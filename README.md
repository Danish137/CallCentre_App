# On-Ground.ai Call Centre Staff Application

A high-performance, production-ready implementation of the **On-Ground.ai Call Centre Staff Application** built for automotive and retail tele-callers. Built strictly according to the assignment requirements and visual design specifications (`OnGround_Engineering_Assignment.pdf` and `OnGround_CallCentre_App_Mock.html`).

* **Live Deployment:** [https://callcentre.danisakhtar.in](https://callcentre.danisakhtar.in)
* **GitHub Repository:** [https://github.com/Danish137/CallCentre_App](https://github.com/Danish137/CallCentre_App)
* **Candidate:** Danish Akhtar

---

## 1. Executive Summary & Features Built

| Requirement Area | Specification in PDF | Implemented Status | Details |
|---|---|---|---|
| **Human-to-Human Calling** | Mandatory ("Must include working calling") | **✅ Completed & Verified** | Real outbound PSTN bridging via **Exotel** (`07481882716` ↔ `06327314862` via ExoPhone `08047290468`). Captures true carrier CDR duration, live SSE lifecycle states, and wrap-up notes. |
| **AI-to-Human Calling** | "Show H2H and AI-to-human calling" | **✅ Completed & Built** | Interactive **AI Voice Lead Caller** ("Mukunda R.") powered by **Gemini Flash**. Real-time microphone capture, natural voice playback, live audio waveform, and dynamic 6-step SOP adherence tracking. |
| **Net Practise / Rehearsal** | Bonus: "The Practise a call screen" | **✅ Completed** | Complete Net Practise sandbox matching original mock with 6 modules, model script examples, audio recording, and instant rubric scoring. |
| **App Shell & Layout** | Must build: Sidebar & Top bar | **✅ Completed** | Native styling, active route pills, IST time display, live queue badges, and telephony status indicator. |
| **Dashboard** | KPI cards, progress, who's waiting, earnings, 7-day charts | **✅ Completed** | 4 KPI cards, "Who's waiting" queue with direct call actions, earnings progress slab, task list linked to leads, and custom SVG trend charts. |
| **Plan (3 + 1 Screens)** | Calls to make, Incoming, Recent, Practise | **✅ Completed** | Ranked lead scoring with accordion paging, ₹ value at stake with "Call back" on every row, and Recent calls with 6-step SOP review modal. |
| **Shift Calendar** | Month grid, today jump, event dots | **✅ Completed** | Synchronized calendar grid, previous/next month navigation, "Today" quick-jump, and add event modal. |
| **Pulse Home & Channel** | Pinned card, chat bubbles, agents | **✅ Completed** | AvaniBot hero card, role & task agents, interactive "Needs your input" decision card with responses, and real-time messaging. |
| **Leads Modal with Paging** | Opens from task list, ICP & intent score, collapsible buying signals | **✅ Completed** | Modal with 94% ICP / 91% Intent score, collapsible financing/warranty/quotation signals, and `<` `>` paging. |

---

## 2. Telephony Architecture: How Calling Works

### A. Real Human-to-Human (H2H) Calling (Exotel PSTN Gateway)
For real outbound telephone calling in India, the application integrates with **Exotel**:

```
[Agent Browser] ──(1. Click Call)──> [Express Backend] ──(2. Connect Call)──> [Exotel API]
       ▲                                                                               │
       │                                                                      (3. Dials Agent Phone)
       │                                                                               ▼
       │                                                                    [Agent Mobile Handset]
       │                                                                               │ (Agent answers)
       │                                                                               ▼
       │                                                                    (4. Dials Lead Phone)
       │                                                                               ▼
       │                                                                    [Customer Mobile Handset]
       │                                                                               │ (PSTN Bridged!)
       │<───(5. SSE Stream: Initiating ➔ Ringing ➔ In-Progress ➔ Completed)────────────┘
```

1. **Initiation:** The tele-caller clicks **Call** on any lead or **Call back** on a missed call.
2. **Pre-Call SOP Checklist:** Displays customer context, buying signals, and objections before dialing.
3. **PSTN Bridge Dispatch:** Our backend triggers Exotel's `POST /v1/Accounts/{SID}/Calls/connect.json` specifying the Agent's verified number (`From`), the Lead's phone number (`To`), and the assigned virtual ExoPhone (`CallerId: 08047290468`).
4. **Lifecycle & Duration Precision:**
   - Exotel webhooks stream status updates to `/api/telephony/exotel/status-callback`.
   - To guarantee zero-failure tracking on trial environments without inbound tunneling, a resilient **asynchronous poller and delayed CDR reconciler** runs at 1.5s and 3.5s post-hangup, pulling the carrier-finalized `Duration` directly from Exotel's CDR records.
5. **Call Wrap-up:** Upon hangup, the agent records the disposition (`Interested`, `Callback Booked`, etc.) and notes, saving it with true carrier metadata.

---

### B. AI-to-Human Calling (Gemini Flash Voice Agent)
To allow anyone (including reviewers) to test voice calling directly on the web app without needing pre-verified carrier phone numbers:

```
[Agent / Reviewer] ──(Microphone)──> [Web Speech API] ──(Text Stream)──> [Gemini Flash AI Engine]
       ▲                                                                            │
       │                                                                 (Context & SOP Analysis)
       │                                                                            ▼
       └──────────(Spoken Voice Audio)── [SpeechSynthesis] <───────(Conversational Response)
```

1. **Interactive AI Voice Call:** Under **Plan** ➔ **Practise a call**, click **Start Live AI Call**.
2. **Conversational Engine:**
   - Powered by **Gemini Flash** (via optional `GEMINI_API_KEY`) with an intelligent, dynamic domain conversational engine for **The Sleep Company**.
   - The AI plays **Priya Iyer**, a customer seeking relief from lower back pain, exploring the **SmartGRID Ortho Pro Mattress** with realistic questions about back support, memory foam heat trapping vs. SmartGRID airflow, 100-night trial, and No-Cost EMI.
3. **Live Audio Feedback:**
   - The user speaks through their laptop microphone (or types into the live chat).
   - The AI answers with natural spoken voice synthesis.
   - A real-time **SOP Adherence Tracker** scans the conversation live and dynamically awards checkmarks across the 6 checkpoints (`Opening`, `Needs Discovery`, `Product Pitch`, `EMI / Financing`, `Warranty`, `Closing`).

---

## 3. Tech Stack & Architectural Decisions

* **Frontend:** React 19 + TypeScript + Vite.
* **Styling:** CSS Modules with custom design tokens for strict encapsulation matching the mock design.
* **State & Streaming:** Real-time **Server-Sent Events (SSE)** via Express for zero-latency telephony updates.
* **Backend:** Node.js + Express + TypeScript serving both REST APIs, SSE endpoints, and static frontend assets in a unified production bundle.
* **Telephony Gateway:** Pluggable Telephony Provider pattern supporting **Exotel**, **Twilio**, and **Dev Simulator**.
* **AI Intelligence:** Gemini Flash conversational model + Web Speech Recognition + SpeechSynthesis.

---

## 4. How to Run Locally

### Prerequisites
* Node.js v18+ (tested on Node v24)
* npm v9+

### Quick Start
```bash
# 1. Clone repository
git clone https://github.com/Danish137/CallCentre_App.git
cd CallCentre_App

# 2. Install dependencies
npm install
cd client && npm install
cd ../server && npm install
cd ..

# 3. Build & Run unified production service
npm run build
npm start
```

Open your browser to: **`http://localhost:5000`**

### Development Mode (Concurrent HMR)
```bash
npm run dev
```
* Backend: `http://localhost:5000`
* Frontend (Vite HMR): `http://localhost:5173`

---

## 5. Deployment Guide (Free & Zero-Cost)

The app is deployed live at **`https://callcentre.danisakhtar.in`** on **Render**:

1. **Host:** Render Web Service (Free Tier, 750 hours/month).
2. **Domain & DNS:** `danisakhtar.in` managed on Hostinger DNS. A single CNAME record points `callcentre` ➔ `your-service.onrender.com`.
3. **SSL Certificate:** Free automatic Let's Encrypt SSL provisioned and managed by Render.
4. **Unified Build:** The single Web Service compiles both client and server (`npm run build`), eliminating CORS and proxy configuration.

---

## 6. AI Tools Used

In accordance with assignment guidelines:
* **Google DeepMind Antigravity:** Agentic pair programming, TypeScript schema definition, layout implementation, and telephony adapter integration.
* **Google Gemini 2.0 / 1.5 Flash:** Powering the conversational AI-to-human voice lead engine.

---

## 7. Submission Details

* **To:** `mukunda@on-ground.ai`
* **CC:** `rashmi@on-ground.ai`
* **Subject:** `Assignment Submission: Danish Akhtar`
* **Deadline:** Thursday, 5 November 2026, 9:04:03 PM IST
