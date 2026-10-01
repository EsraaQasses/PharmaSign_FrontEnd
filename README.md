<div align="center"> <img src="assets/images/logo.png" alt="PharmaSign logo" width="140" />
PharmaSign — Mobile App

Helping deaf and hard-of-hearing patients understand their medication instructions in Arabic Sign Language.

نظام ذكي يساعد الصم وضعاف السمع على فهم تعليمات استخدام الأدوية داخل الصيدليات



</div>
About

In most pharmacies, medication counseling happens by voice. For deaf and hard-of-hearing patients this creates a real risk of misunderstanding the dose, timing, or warnings of a medicine.

PharmaSign closes that gap. The pharmacist records the instructions by voice, reviews the generated text, and the system turns it into an Arabic Sign Language video played by an avatar. The patient opens the prescription on their phone and can replay the instructions at any time, without needing an interpreter.

This repository contains the mobile app (patient and pharmacist interfaces), built with React Native and Expo. It is part of a graduation project at the Faculty of Informatics Engineering, AL Sham Private University (ASPU), 2026.

How it works
🎙️ Pharmacist recordsinstructions
Speech-to-Text
✍️ Pharmacist reviewsand approves text
Text-to-Gloss
Gloss-to-Pose
Pose-to-Avatar
📱 Patient watchessign-language video
Features
For patients
Quick QR login: scan a code from the pharmacy to sign in, no typing needed.
Prescriptions: view all prescriptions and each medication's instructions in sign language.
Session QR: show a personal code to the pharmacist to start a dispensing session.
Pharmacies map: browse nearby pharmacies and their details.
Sign tutorial and app guide: visual onboarding designed for deaf users.
Notifications, profile, security, and privacy settings.
For pharmacists
Scan patient: open a patient's session by scanning their QR code with the camera.
New prescription: enter the medication's basic data.
Record audio: dictate the instructions instead of typing them.
Verify text: review and correct the transcribed text before approval (human-in-the-loop).
Generate sign: send the approved text to the AI pipeline and deliver the result to the patient.
Prescription history and details.
<!-- ## Screenshots Add 3–4 screenshots here (put them in a `docs/screenshots` folder), for example: <p align="center"> <img src="docs/screenshots/patient-home.png" width="220" /> <img src="docs/screenshots/medication-view.png" width="220" /> <img src="docs/screenshots/record-audio.png" width="220" /> <img src="docs/screenshots/verify-text.png" width="220" /> </p> -->
Tech stack
Area	Tools
Framework	React Native, Expo, Expo Router (file-based routing, typed routes)
Language	JavaScript, TypeScript
Styling	NativeWind (Tailwind CSS), Cairo font for Arabic UI
Data fetching	TanStack React Query, REST API client with Arabic error messages
Device features	expo-camera (QR scanning), expo-av (audio), react-native-qrcode-svg, react-native-maps
Storage and auth	AsyncStorage token storage, auth context, protected routes
Project structure
app/
├── Splash.jsx, Onboarding.jsx, RoleSelect.jsx   # entry flow
├── patient/        # patient screens (login, prescriptions, medication view, QR, map...)
└── pharmacist/     # pharmacist screens (scan, new prescription, record audio, verify text...)
api/                # REST API modules: auth, prescriptions, sessions, pharmacies, profile
components/
├── mobile/         # app shell, navigation, headers, map, status badges
└── ui/             # reusable UI primitives (button, card, input, alert...)
lib/                # auth context, query client, helpers
utils/              # token storage, formatters, phone utilities
Getting started

Requirements: Node.js 18+ and the Expo Go app (or an Android/iOS emulator).

bash
git clone https://github.com/EsraaQasses/PharmaSign_FrontEnd.git
cd PharmaSign_FrontEnd
npm install
npx expo start

Then scan the QR code with Expo Go, or press a for Android, i for iOS, or w for web.

Connecting to the backend

The API base URL is set in api/client.js. It points to the hosted backend by default. For local development, change it to:

Environment	URL
Web	http://127.0.0.1:8000/api
Android emulator	http://10.0.2.2:8000/api
Physical device	http://<your-LAN-IP>:8000/api
Related repositories
PharmaSign_BackEnd: Django REST API
PharmaSign_AI: AI pipeline (Speech-to-Text, Text-to-Gloss, Gloss-to-Pose, avatar)
Team
Name	Role
Mahmoud Alhosen	Mobile app (React Native), Speech-to-Text, Pose-to-Avatar
Esraa Nabil Qasses	Backend and AI pipeline

AI modules for Text-to-Gloss and Gloss-to-Pose were developed jointly.

Supervisors: Dr. Afaf Al-Shalabi, Eng. Nour Al-Hakim Faculty of Informatics Engineering, AL Sham Private University (ASPU), Damascus.
