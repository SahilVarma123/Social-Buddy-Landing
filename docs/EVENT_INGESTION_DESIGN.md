# Social Buddy — Event Ingestion & Moderation Specification

> **Component:** Event Ingestion Pipeline & Moderation Rules  
> **Status:** Architecture Draft (Phase 3)  
> **Applicable Standard:** VecnaVerse Problem Statement 1

---

## 1. Overview & Ethical Ingestion Principles

Hyperlocal event discovery platforms succeed or fail based on **information freshness, accuracy, and trust**. Scraping private chats, bypassing rate limits, or inventing artificial events produces bad user experiences and destroys platform credibility.

Social Buddy adopts three core principles:
1. **Consent & Verification:** Every event must originate from an accountable human organizer, an accredited community entity, or a documented public data source.
2. **Transparent Provenance:** Users can inspect who submitted the event, when it was verified, and what proof supports its listing.
3. **Deterministic Deduplication:** Incoming events from multiple feeds or community submissions must be matched and deduplicated before reaching user feeds.

---

## 2. Ingestion Pipelines

```
                   +------------------------------+
                   | Community User Submission    |
                   +------------------------------+
                                  |
                                  v
+-----------------------+  [Automated Quality Filter]  +------------------------+
| Organizer Direct Feed |  - Minimum character limits   | Public Whitelisted Feed|
| - Verified domain     |  - Valid future timestamp     | - Campus RSS / JSON    |
| - Organizer dashboard |  - Valid coordinates          | - Partner API feed     |
+-----------------------+  - Profanity / scam check     +------------------------+
            |                     |                                 |
            v                     v                                 v
[Direct Approved State]    [Pending Queue]               [Fingerprint Matcher]
                                  |                                 |
                                  v                                 v
                        [Human Moderator Action]         [Update or Insert]
                                  |
                      +-----------+-----------+
                      |                       |
                      v                       v
                 [Approved]              [Rejected]
```

### 2.1 Path A: Organizer-Submitted Events
* **Target Users:** Club presidents, festival directors, comedy club owners, sports organizers.
* **Requirements:**
  * Verified organizer profile (`verification_tier != 'unverified'`).
  * Dedicated contact email and verified physical venue coordinates.
* **Workflow:**
  1. Organizer logs in and enters event details.
  2. Location coordinates are resolved via forward geocoding (Nominatim / Mapbox).
  3. Pre-authorized organizers bypass the pending queue; listing transitions immediately to `approved` with `verification_tier = 'partner_verified'`.

### 2.2 Path B: Community-Submitted Events
* **Target Users:** College attendees, pickup game hosts, hackathon participants.
* **Requirements:**
  * Authenticated user account (`auth.uid()`).
  * Title (10–100 characters), description (min 20 characters), venue name, date/time in the future, category.
* **Quality Safeguards:**
  * Rate-limit: Maximum 3 event submissions per user every 24 hours.
  * Auto-reject events starting in the past or with coordinates outside the platform's supported regions.
  * Status assigned: `pending`. Listing is **invisible** in the public discovery feed until approved by a moderator.

### 2.3 Path C: Approved Public Feeds & Open APIs
* **Target Sources:**
  * College/University publicly published academic and cultural calendars (RSS / iCal).
  * Municipal cultural center calendar feeds.
  * Open event datasets with explicit permissive licenses (e.g., Creative Commons, Open Data Commons).
* **Ingestion Worker (Scheduled Cron):**
  1. Fetches canonical RSS/JSON endpoints on a 6-hour cron schedule.
  2. Normalizes dates into standard ISO-8601 UTC.
  3. Generates deduplication fingerprints.
  4. Stores raw JSON in `event_sources.raw_payload` for traceability.

---

## 3. Deduplication Algorithm

To prevent multiple listings for the same concert, hackathon, or comedy gig:

```python
import hashlib
import re

def generate_event_fingerprint(title: str, start_iso: str, venue_lat: float, venue_lon: float) -> str:
    # 1. Normalize title (lowercase, remove punctuation, strip whitespace)
    normalized_title = re.sub(r'[^a-z0-9]', '', title.lower())
    
    # 2. Extract calendar date (YYYY-MM-DD) to group recurring festivals
    calendar_date = start_iso.split('T')[0]
    
    # 3. Round coordinates to ~110m resolution (3 decimal places)
    lat_bucket = f"{round(venue_lat, 3):.3f}"
    lon_bucket = f"{round(venue_lon, 3):.3f}"
    
    # 4. Hash deterministic string
    raw_signature = f"{normalized_title}|{calendar_date}|{lat_bucket}|{lon_bucket}"
    return hashlib.sha256(raw_signature.encode('utf-8')).hexdigest()
```

* **Handling Collision:**
  * If the SHA-256 fingerprint matches an existing record:
    * If the incoming record is from an **Official Organizer**, it updates the title, image, and description of the existing entry while preserving existing user bookmarks and RSVPs.
    * If the incoming record is a **Community Submission**, it notifies the submitter: *"An event matching this title and location is already on Social Buddy."*

---

## 4. Moderation Console & Auditability

1. **Moderator Actions:**
   * **Approve:** Sets `moderation_status = 'approved'`, records `moderated_by` and `moderated_at`.
   * **Reject:** Sets `moderation_status = 'rejected'`, sets required `rejection_reason` (e.g. invalid venue, duplicate, commercial spam).
   * **Flag as Demo:** Sets `moderation_status = 'demo'`, ensuring it only appears when demonstration toggle is active.
2. **Audit Logging:**
   * Every status transition is logged in PostgreSQL with actor ID and timestamp.
   * Standard users are forbidden by RLS from altering moderation status fields.
