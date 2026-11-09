# Self-Service Portlet

NetSuite Portlet script (`NC_SelfServicePortlet.js`) that shows a dashboard of self-service request cards, driven by the custom record `customrecord_nc_self_serv_req`.

## Overview

- **Script type:** Portlet (SuiteScript 2.0, `@NApiVersion 2.0`)
- **Modules:** `N/log`, `N/search`
- **Portlet title:** Self-Service Requests
- **Environment:** Sandbox (SB1)

## How it works

1. Searches all active (`isinactive = F`) records of `customrecord_nc_self_serv_req`, sorted by name (up to 1000).
2. Renders one card per record in a responsive grid.
3. Each card shows the title, request type, action links and instructions.
4. If no records exist, an empty-state message is shown. Errors are logged via `N/log` and a short message is displayed in the portlet.

## Record fields used

| Field ID | Purpose |
|---|---|
| `name` | Card title (falls back to request type) |
| `custrecord_nc_req_type` | Request type label |
| `custrecord_nc_click_req_selfserv` | URL for the **Create Request** button |
| `custrecord_nc_template_` | URL for the **Download Documentation** button |
| `custrecord_nc_instructions_` | Rich text instructions (rendered as HTML) |

## Deployment

1. Upload `NC_SelfServicePortlet.js` to the NetSuite File Cabinet.
2. Create a Script record (Customization > Scripting > Scripts > New) of type Portlet.
3. Create a Script Deployment and add the portlet to the desired dashboards.

## Notes

- Text fields are HTML-escaped. The instructions field is intentionally output as-is because it is Rich Text maintained in NetSuite, so only trusted users should edit it.
- Links open in a new tab.

## Change log

- 2026-11-09: Initial commit of the portlet and README.
