# Tool reference

All tools return formatted text. Report tools fetch a curated set of relationships in one batched call; use the relationship tools to page through the full list of one type (`limit` 1-40, plus the `cursor` from the previous page).


## Report Tools (with Automatic Relationship Fetching)

### 1. URL Report Tool
- Name: `get_url_report`
- Description: Get a comprehensive URL analysis report including security scan results and key relationships (communicating files, contacted domains/IPs, downloaded files, redirects, threat actors). Returns the cached VirusTotal report when available; only submits the URL for scanning and polls for completion on a cache miss
- Parameters:
  * `url` (required): The URL to analyze

### 2. File Report Tool
- Name: `get_file_report`
- Description: Get a comprehensive file analysis report using its hash (MD5/SHA-1/SHA-256). Includes detection results, file properties, and key relationships (behaviors, dropped files, network connections, embedded content, threat actors)
- Parameters:
  * `hash` (required): MD5, SHA-1 or SHA-256 hash of the file

### 3. IP Report Tool
- Name: `get_ip_report`
- Description: Get a comprehensive IP address analysis report including geolocation, reputation data, and key relationships (communicating files, historical certificates/WHOIS, resolutions)
- Parameters:
  * `ip` (required): IP address to analyze

### 4. Domain Report Tool
- Name: `get_domain_report`
- Description: Get a comprehensive domain analysis report including DNS records, WHOIS data, and key relationships (SSL certificates, subdomains, historical data)
- Parameters:
  * `domain` (required): Domain name to analyze
  * `relationships` (optional): Array of specific relationships to include in the report

## Relationship Tools (for Detailed Analysis)

### 1. URL Relationship Tool
- Name: `get_url_relationship`
- Description: Query a specific relationship type for a URL with pagination support. Choose from 22 relationship types including analyses, communicating files, contacted domains/IPs, downloaded files, graphs, referrers, redirects, threat actors, collections, and votes
- Parameters:
  * `url` (required): The URL to get relationships for
  * `relationship` (required): Type of relationship to query
    - Available relationships: analyses, collections, comments, communicating_files, contacted_domains, contacted_ips, downloaded_files, embedded_js_files, graphs, last_serving_ip_address, network_location, referrer_files, referrer_urls, redirecting_urls, redirects_to, related_comments, related_references, related_threat_actors, submissions, urls_related_by_tracker_id, user_votes, votes
  * `limit` (optional, default: 10): Maximum number of related objects to retrieve (1-40)
  * `cursor` (optional): Continuation cursor for pagination

### 2. File Relationship Tool
- Name: `get_file_relationship`
- Description: Query a specific relationship type for a file with pagination support. Choose from 40 relationship types including behaviors, network connections, dropped files, embedded content, execution chains, and threat actors
- Parameters:
  * `hash` (required): MD5, SHA-1 or SHA-256 hash of the file
  * `relationship` (required): Type of relationship to query
    - Available relationships: analyses, behaviours, bundled_files, carbonblack_children, carbonblack_parents, ciphered_bundled_files, ciphered_parents, collections, comments, compressed_parents, contacted_domains, contacted_ips, contacted_urls, dropped_files, email_attachments, email_parents, embedded_domains, embedded_ips, embedded_urls, execution_parents, graphs, itw_domains, itw_ips, itw_urls, memory_pattern_domains, memory_pattern_ips, memory_pattern_urls, overlay_children, overlay_parents, pcap_children, pcap_parents, pe_resource_children, pe_resource_parents, related_references, related_threat_actors, similar_files, submissions, screenshots, urls_for_embedded_js, votes
  * `limit` (optional, default: 10): Maximum number of related objects to retrieve (1-40)
  * `cursor` (optional): Continuation cursor for pagination

### 3. IP Relationship Tool
- Name: `get_ip_relationship`
- Description: Query a specific relationship type for an IP address with pagination support. Choose from 15 relationship types including communicating files, historical SSL certificates, WHOIS records, resolutions, threat actors, and votes
- Parameters:
  * `ip` (required): IP address to analyze
  * `relationship` (required): Type of relationship to query
    - Available relationships: collections, comments, communicating_files, downloaded_files, graphs, historical_ssl_certificates, historical_whois, related_comments, related_references, related_threat_actors, referrer_files, resolutions, urls, user_votes, votes
  * `limit` (optional, default: 10): Maximum number of related objects to retrieve (1-40)
  * `cursor` (optional): Continuation cursor for pagination

### 4. Domain Relationship Tool
- Name: `get_domain_relationship`
- Description: Query a specific relationship type for a domain with pagination support. Choose from 24 relationship types including SSL certificates, subdomains, historical data, DNS records, and collections
- Parameters:
  * `domain` (required): Domain name to analyze
  * `relationship` (required): Type of relationship to query
    - Available relationships: caa_records, cname_records, collections, comments, communicating_files, downloaded_files, graphs, historical_ssl_certificates, historical_whois, immediate_parent, mx_records, ns_records, parent, referrer_files, related_comments, related_references, related_threat_actors, resolutions, soa_records, siblings, subdomains, urls, user_votes, votes
  * `limit` (optional, default: 10): Maximum number of related objects to retrieve (1-40)
  * `cursor` (optional): Continuation cursor for pagination

## Search & Pivot Tools

### 1. Corpus Search
- Name: `search_vt`
- Description: Search the VirusTotal corpus for files, URLs, domains, IPs, or comments matching a query. Accepts plain IOCs (hash, URL, domain, IP), free text against comments, or VTI-style search modifiers
- Parameters:
  * `query` (required): Search query. Examples: a SHA-256 hash, `evil.com`, `8.8.8.8`, `type:peexe size:90kb+ tag:signed positives:5+`
  * `limit` (optional, default: 20): Maximum number of results (1-300)
  * `cursor` (optional): Continuation cursor for pagination

### 2. File Behaviour Summary
- Name: `get_file_behaviour_summary`
- Description: Get a consolidated sandbox behaviour summary for a file, merged across every sandbox that analyzed it. Returns processes, files, registry, network activity, DNS lookups, MITRE ATT&CK techniques, IDS alerts, and signature matches in a single view — far more useful than iterating individual behaviour reports
- Parameters:
  * `hash` (required): MD5, SHA-1 or SHA-256 hash of the file

### 3. Collection Lookup
- Name: `get_collection`
- Description: Retrieve a VirusTotal collection by ID. Collections represent threat actors, malware families, campaigns, intel reports, and curated IOC sets — often referenced from the `related_threat_actors` and `collections` relationships on other tools. Optionally include relationships to fetch member IOCs in the same call
- Parameters:
  * `id` (required): Collection ID (e.g. `threat-actor--<uuid>`, `malware-family--<id>`)
  * `relationships` (optional): Array of relationship names to include
    - Available relationships: autogenerated_graphs, comments, domains, files, ip_addresses, owner, references, related_collections, related_references, threat_actors, urls
