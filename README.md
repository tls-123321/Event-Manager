# Event Manager

A full-stack event management application with a Django REST API backend and a React (Vite) frontend.

## How It Works

- Firstly database should be created and connected using .env.
- Events can be added from admin page
- Users need to create account to be able to create bookings. 
- After creating booking codes are automatically generated and stored then displayed on user's profile page alongside event's name and status.
- For booking management you can write code on events page in the field of desired event.
- You can navigate through pages by navbar


## Prerequisites
- Python 3.12+
- Node.js
- npm



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
   cd Event-Manager
   pip install -r requirements.txt
   ```

## Environment Variables
- Create and connect database
- Configure environment variables in a `.env` file according to `.env.sample` in the `eventManager` directory.

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
   ```sh
   npm install react-router-dom
   ```
3. **Run the frontend development server**
   ```sh
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173/`



