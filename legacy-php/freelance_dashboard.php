<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require 'db.php';

if (!isset($_SESSION["user_id"])) {
    header("Location: login.php");
    exit;
}

$user_id = $_SESSION["user_id"];

$stmt = $conn->prepare("SELECT username, role FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->bind_result($username, $role);
$stmt->fetch();
$stmt->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Adventurer's Dashboard</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="styles/main.css">
  <style>
    body {
      background-color: #1a1a1a; /* Very dark background */
      color: #e0e0e0; /* Light text for readability */
      font-family: 'Inter', sans-serif; /* Modern, clean font */
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }

    .container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #1a1a1a; /* Ensure container matches body */
    }

    /* Top Navigation Bar - Minimalist Dark */
    .top-nav {
      background-color: #2a2a2a; /* Slightly lighter dark for contrast */
      padding: 15px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); /* Subtle shadow */
    }

    .top-nav .welcome-message {
      font-size: 1.4rem;
      padding-left: 40px;
      font-weight: 550;
      color: #f0f0f0;
    }

    .top-nav .nav-links a {
      color: #f0f0f0; /* Lighter grey for links */
      text-decoration: none;
      margin-left: 25px;
      font-size: 1.0rem;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .top-nav .nav-links a:hover {
      color: #ffffff; /* White on hover */
    }

    /* Main Content Area */
    .main-content {
      flex-grow: 1;
      padding: 20px;
    }

    /* Hero Greeting - Minimalist */
    .hero-greeting {
      background: none; /* Remove gradient */
      padding: 2rem 1.5rem; /* Adjust padding */
      text-align: center; /* Center text */
      margin-bottom: 2rem;
    }

    .hero-greeting h2 {
      color: #e0e0e0; /* Consistent heading color */
      font-size: 2.2rem;
      margin-bottom: 10px;
      font-weight: 600;
    }

    .hero-greeting p {
      color: #b0b0b0; /* Lighter grey for paragraph */
      max-width: 800px;
      margin: 0 auto;
      font-size: 1rem;
    }

    /* Quest Section - Adapting to dark mode */
    .quest-section {
      margin: 2rem 0;
      padding: 1rem;
      background-color: #2a2a2a; /* Dark background for sections */
      border-radius: 8px; /* Slightly rounded corners */
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow */
    }
    .quest-section h2 {
      margin-bottom: 1rem;
      color: #f0f0f0; /* Light heading for readability */
      font-size: 1.6rem;
    }
    .quest-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      padding-bottom: 1rem;
    }
    .quest-card {
      background: #333333; /* Darker card background */
      border: 1px solid #444444; /* Darker border */
      border-radius: 10px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      padding: 1.5rem;
      color: #e0e0e0; /* Light text for readability */
      display: flex;
      flex-direction: column;
      height: 100%;
      box-sizing: border-box;
      transition: transform 0.2s ease-in-out;
    }
    .quest-card:hover {
      transform: translateY(-5px);
    }
    .quest-card h3 {
      color: #ffffff; /* White title */
      font-size: 1.2rem;
      margin-top: 0;
      margin-bottom: 0.8rem;
    }
    .quest-card p {
      font-size: 0.95rem;
      margin-bottom: 0.5rem;
      color: #c0c0c0; /* Slightly lighter grey for paragraph text */
      flex-grow: 1; /* Allow content to push button down */
    }
    .quest-card small {
      display: block;
      color: #888888; /* Dimmed text for small details */
      margin-top: 0.5rem;
    }
    .quest-card .accept-btn, .quest-card .status-btn {
      background-color: #88b649; /* Blue for actions */
      color: white;
      padding: 10px 15px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 0.9rem;
      margin-top: 1rem;
      transition: background-color 0.3s ease;
      width: 100%;
      box-sizing: border-box;
    }
    .quest-card .accept-btn:hover, .quest-card .status-btn:hover {
      background-color: #56742cff; /* Darker blue on hover */
    }
    .quest-card a {
      color: #61dafb; /* Light blue for links */
      text-decoration: none;
    }
    .quest-card a:hover {
      text-decoration: underline;
    }

    /* Forms */
    form {
        margin-top: 20px;
        padding: 20px;
        background-color: #2a2a2a;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    form h3 {
        color: #f0f0f0;
        margin-bottom: 15px;
    }
    form input[type="text"],
    form input[type="email"],
    form input[type="password"],
    form input[type="tel"],
    form input[type="date"],
    form textarea,
    form select,
    form input[type="number"] {
        width: calc(100% - 20px);
        padding: 12px;
        margin-bottom: 15px;
        border: 1px solid #444444;
        border-radius: 5px;
        background-color: #333333;
        color: #e0e0e0;
        font-size: 0.95rem;
        box-sizing: border-box;
    }
    form input::placeholder,
    form textarea::placeholder {
        color: #888888;
    }
    form button[type="submit"] {
        background-color: #88b649;
        color: white;
        padding: 12px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.3s ease;
    }
    form button[type="submit"]:hover {
        background-color: #56742cff;
    }
    .error-message {
        color: crimson;
        margin-bottom: 15px;
    }

    /* Specific to freelancer_accepted_quests */
    .quest-card select {
        width: 100%;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid #555;
        background-color: #444;
        color: #e0e0e0;
        margin-top: 10px;
    }
    .quest-card input[type="file"] {
        margin-top: 10px;
        color: #e0e0e0;
    }
    .quest-card input[type="file"]::file-selector-button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .quest-card input[type="file"]::file-selector-button:hover {
        background-color: #0056b3;
    }
  </style>
</head>
<body>
  <div class="container">
    <nav class="top-nav">
      <div class="welcome-message">Welcome <?= htmlspecialchars($username) ?></div>
      <div class="nav-links">
        <?php if ($role === 'client'): ?>
          <a href="client_dashboard.php"><i class="icon"></i>Posted Quests</a>
          <a href="post_quest.php"><i class="icon"></i>Add Quest</a>
        <?php endif; ?>
        <a href="profile.php"><i class="icon"></i>Profile</a>
        <a href="logout.php"><i class="icon"></i>Logout</a>
      </div>
    </nav>

    <main class="main-content">
      <section class="hero-greeting">
        <h2>The Questboard</h2>
        <p>This is your Quest Board — post tasks, hire adventurers, and manage your missions like a guildmaster.</p>
      </section>

      <?php
      if ($role === 'freelancer') {
          include 'freelance_dashboard_quests.php';
          include 'freelancer_accepted_quests.php';
      } elseif ($role === 'client') {
          include 'client_quest_grid.php';
      }
      ?>
    </main>
  </div>
</body>
</html>