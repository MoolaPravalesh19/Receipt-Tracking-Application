📄 Receipt Scanning Application

A Receipt Scanning Application that allows users to scan receipts, automatically extract necessary details, and provide structured information back to the user.
This project leverages AI (Inngest Agent) for receipt data extraction, integrates authentication and payment flow, and is styled for a modern, responsive experience.

🚀 Features

📷 Receipt Scanning – Upload or capture receipts for instant analysis.

🤖 AI-Powered Extraction – Uses Inngest AI Agent to extract key details (store, date, items, total, tax, etc.).

💳 Payment Gateway – Integrated using Schematic for testing payment flows.

🔐 Authentication – Implemented with Clerk for secure and seamless login/signup.

🎨 Modern UI – Built with Tailwind CSS for responsive and clean styling.

🌐 Deployment – Hosted on Render for easy access and scalability.

🛠️ Tech Stack

Frontend Framework: Next.js

Authentication: Clerk

Styling: Tailwind CSS

AI Receipt Processing: Inngest AI Agent

Payment Gateway (Testing): Schematic

Deployment: Render

📂 Project Structure
├── public/             # Static assets  
├── src/                # Source code  
│   ├── components/     # Reusable UI components  
│   ├── pages/          # Next.js pages  
│   ├── styles/         # Tailwind CSS config and globals  
│   ├── utils/          # Helper functions  
│   └── lib/            # API and integration logic  
├── .env.example        # Example environment variables  
├── package.json        # Dependencies and scripts  
└── README.md           # Project documentation  

⚙️ Setup & Installation
1️⃣ Clone the repository
git clone https://github.com/your-username/receipt-scanning-app.git
cd receipt-scanning-app

2️⃣ Install dependencies
npm install

3️⃣ Set up environment variables

Create a .env.local file in the root directory and add:

CLERK_API_KEY=your_clerk_api_key
INNGEST_API_KEY=your_inngest_api_key
SCHEMATIC_API_KEY=your_schematic_api_key

4️⃣ Run the development server
npm run dev


➡️ App will be available at: http://localhost:3000

📦 Deployment

This project is deployed using Render.
Pushing changes to the main branch will trigger automatic deployment.

🔮 Future Improvements

🌍 Support for multi-language receipts.

📊 Export receipts as PDF/Excel reports.

📈 Advanced analytics for expense tracking.

👥 Team/organization-level receipt management.

🤝 Contributing

Contributions, issues, and feature requests are welcome! 🎉

Fork the repo

Create a new branch

Submit a pull request 🚀

📜 License

This project is licensed under the MIT License – see the LICENSE
 file for details.
