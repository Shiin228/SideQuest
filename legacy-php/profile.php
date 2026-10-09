<?php
session_start();
include_once 'db.php';

$user_id = $_SESSION['user_id'] ?? null;

$id = 'N/A';
$username = 'N/A';
$email = 'N/A';
$created_at = 'N/A';
$role = 'N/A';

if ($user_id) {
    $stmt = $conn->prepare("SELECT id, username, email, created_at, role FROM users WHERE id = ?");
    if ($stmt) {
        $stmt->bind_param("i", $user_id);
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            if ($row = $result->fetch_assoc()) {
                $id = $row['id'];
                $username = htmlspecialchars($row['username']);
                $email = htmlspecialchars($row['email']);
                $created_at = htmlspecialchars($row['created_at']);
                $role = htmlspecialchars($row['role']);
            }
        }
        $stmt->close();
    } else {
        die("Prepare failed: " . $conn->error);
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Profile - SideQuest</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="styles/main.css">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
      background-color: #1a1a1a;
      color: #e0e0e0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    header.top-sidebar {
        background-color: #2a2a2a;
        padding: 1rem 2rem;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    }

    main {
      flex-grow: 1;
      padding: 2rem;
    }

    .profile-section {
      padding: 2rem;
      margin-left: 0;
    }

    .profile-section h2 {
      font-size: 1.8rem;
      margin-bottom: 1.5rem;
      color: #ffffff;
    }

    .profile-container {
      background: rgba(30, 30, 30, 0.8);
      border: 1px solid rgba(60, 60, 60, 0.5);
      border-radius: 12px;
      padding: 2rem;
      max-width: 600px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }

    .profile-container h2 {
      font-size: 1.5rem;
      margin-top: 0;
      margin-bottom: 1.5rem;
      color: #ffffff;
    }

    .profile-box p {
      margin: 0.8rem 0;
      font-size: 1.1rem;
      color: #c0c0c0;
    }

    .profile-box strong {
      color: #e0e0e0;
    }

    .top-sidebar nav ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        gap: 20px;
    }

    .top-sidebar nav ul li a {
        color: #e0e0e0;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        transition: background-color 0.3s ease;
    }

    .top-sidebar nav ul li a:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
  </style>
</head>
<body>
  <header class="top-sidebar">
    <?php include 'components/sidebar.php'; ?>
  </header>

  <main>
    <section class="profile-section">
      <h2>Adventurer Profile</h2>
      <div class="profile-container">
        <h2>Profile Overview</h2>
        <div class="profile-box">
          <p><strong>User ID:</strong> <?= $id ?></p>
          <p><strong>Username:</strong> <?= $username ?></p>
          <p><strong>Email:</strong> <?= $email ?></p>
          <p><strong>Role:</strong> <?= $role ?></p>
          <p><strong>Account Created:</strong> <?= $created_at ?></p>
        </div>
      </div>
    </section>
  </main>
</body>
</html>