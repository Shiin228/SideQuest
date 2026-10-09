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

$stmt = $conn->prepare("SELECT username FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->bind_result($username);
$stmt->fetch();
$stmt->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Client Questboard</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    body {
      background-color: #1a1a1a;
      color: #e0e0e0;
      font-family: 'Inter', sans-serif;
      margin: 0;
      padding-top: 60px;
    }

    .hero-greeting {
      background-color: #282828;
      padding: 1.5rem 2rem;
      margin: 1.5rem 2rem;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }

    .hero-greeting h2 {
      color: #f0f0f0;
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .hero-greeting p {
      color: #e0e0e0;
      max-width: 800px;
      margin: 0 auto;
      font-size: 1rem;
    }

    html, body {
        margin: 0;
        padding: 0;
    }

    .quest-section {
      padding: 2rem;
    }

    .quest-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.5rem;
    }

    .quest-card {
      background-color: #282828;
      border: 1px solid #444;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      padding: 1.2rem;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s ease-in-out, background-color 0.2s ease;
    }

    .quest-card:hover {
      transform: translateY(-5px);
      background-color: #333;
    }

    .quest-card h3 {
      font-size: 1.2rem;
      color: #f0f0f0;
      margin-bottom: 0.5rem;
    }

    .quest-card p {
      color: #e0e0e0;
      font-size: 0.95rem;
      flex-grow: 1;
    }

    .quest-btn {
      all: unset;
      font-style: italic;
      font-weight: bold;
      color: #6dc2ff;
      text-decoration: underline dotted;
      cursor: pointer;
      margin-top: 1rem;
      transition: color 0.3s ease;
    }

    .quest-btn:hover {
      color: #3aaaff;
    }

    .modal {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      background-color: rgba(0, 0, 0, 0.7);
    }

    .modal-content {
      background-color: #282828;
      margin: 5% auto;
      padding: 40px;
      border: 1px solid #444;
      width: 80%;
      max-width: 600px;
      border-radius: 8px;
      position: relative;
      color: #e0e0e0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }

    .modal-content .close {
      position: absolute;
      top: 10px;
      right: 20px;
      font-size: 28px;
      font-weight: bold;
      color: #e0e0e0;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .modal-content .close:hover {
      color: #f0f0f0;
    }
  </style>
</head>
<body>

<div class="background-overlay"></div>

<?php include 'components/client_header.php'; ?>

<main>
  <section class="hero-greeting">
    <h2>The Questboard</h2>
    <p>This is your Quest Board — post tasks, hire adventurers, and manage your missions like a guildmaster.</p>
  </section>

  <?php
  include 'client_quest_grid.php';
  ?>
</body>
</html>