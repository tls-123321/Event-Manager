# Event Manager

A full-stack event management application with a Django REST API backend and a React (Vite) frontend.

## Prerequisites
- Python 3.12+
- Node.js (v18+ recommended)
- npm


# Client requirements
See client_requirements.txt for a list of frontend dependencies. To install client dependencies, run:

cd client
npm install



## Backend Setup (Django)

1. **Clone the repository**
   ```sh
   git clone https://github.com/tls-123321/Event-Manager.git
   cd everntmanager
   ```
2. **Create and activate a virtual environment**
   ```sh
   python -m venv env
   env\Scripts\activate
   ```
   
3. **Install dependencies**
   ```sh
   pip install -r requirements.txt
   ```
   cd client
   npm install

4. **Apply migrations**
   ```sh
   cd eventManager
   python manage.py makemigrations
   python manage.py migrate
   ```
5. **Create a superuser (optional, for admin access)**
   ```sh
   python manage.py createsuperuser
   ```
6. **Run the backend server**
   ```sh
   python manage.py runserver
   ```
   The API will be available at `http://127.0.0.1:8000/`

## Frontend Setup (React + Vite)

1. **Navigate to the client directory**
   ```sh
   cd ../client
   ```
2. **Install frontend dependencies**
   ```sh
   npm install
   ```
3. **Run the frontend development server**
   ```sh
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173/`

## Environment Variables
- Backend: Configure environment variables in a `.env` file according to `.env.sample` in the `eventManager` directory as needed for Database
- Frontend: If needed, add environment variables in `client/.env`.

