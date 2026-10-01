# AIIA Clinical Trial Management System (CTMS) - Frontend

**🌐 Live Demo:** [Click here to view the live application](https://aiia-frontend-bbtp.vercel.app/)
**⚙️ Backend Repository:** [View the FastAPI/Neon backend](https://aiia-backend-t0xe.onrender.com)

The official frontend application for the **All India Institute of Ayurveda (AIIA) Clinical Trial Management System**, built using React, Vite, and modern JavaScript. It connects directly to a FastAPI backend and Neon PostgreSQL database to manage clinical trials, participants, traditional Ayurveda interventions, and ethics regulatory approvals.

## 🚀 Key Features

* **Secure Authentication:** Complete authentication loop supporting User Login, Registration, and Password Recovery using JWT.
* **Executive Dashboard:** Real-time KPI metrics and overview of ongoing clinical studies.
* **Clinical Trial Management:** Track, list, and create new clinical trial records with CTRI registration details.
* **Participant Tracking:** Patient management dashboard for monitoring trial enrollment and data.
* **Ayurveda Interventions & Drug Tracking:** Log and monitor traditional herbal formulations, dosages, anupana (carriers), batch numbers, and patient compliance percentages.
* **Ethics & Regulatory Approvals:** Monitor Institutional Ethics Committee (IEC) clearances and CDSCO/CTRI filings.
* **Dynamic Theming:** Built-in Light and Dark mode UI support.

## 🛠️ Tech Stack

* **Frontend:** React 18, Vite
* **Backend Integration:** FastAPI, Render
* **Database:** PostgreSQL (Neon)
* **API Communication:** Fetch API wrapper (`apiFetch`) communicating with FastAPI endpoints
* **Deployment:** Vercel (Frontend), Render (Backend)


## ⚙️ Getting Started Locally

### Prerequisites
Make sure you have Node.js installed on your machine.

### Installation & Setup

1. Clone the repository:
   ```bash
   git clone [https://github.com/DEB-2006/aiia-frontend.git](https://github.com/DEB-2006/aiia-frontend.git)
   cd aiia-frontend
Install dependencies:

2.
```Bash
  npm install
  Configure your API endpoint connection point in your services layer (src/services/api.js) to point to your local or deployed FastAPI backend.

3.
Run the development server:

````Bash
npm run dev
Open your browser and navigate to http://localhost:5173.
