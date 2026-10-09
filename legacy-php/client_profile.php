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
  <title>Client Profile - SideQuest</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="styles/main.css">
  <style>
    body {
      margin: 0;
      padding-top: 0; 
      font-family: 'Inter', sans-serif; 
      background-color: #1a1a1a; 
      color: #e0e0e0; 
      min-height: 100vh;
    }

    main {
      padding: 2rem;
    }

    .profile-section {
      padding: 2rem;
    }

    .profile-section h2 {
      font-size: 1.8rem;
      margin-bottom: 1.5rem;
      color: #ffffff; 
      text-align: center; 
    }

    .profile-container {
      background: rgba(30, 30, 30, 0.8); 
      border: 1px solid rgba(60, 60, 60, 0.5); 
      border-radius: 12px;
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto; 
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
  </style>
</head>
<body>
  <?php include 'components/client_header.php'; ?>

  <main>
    <section class="profile-section">
      <h2>Client Profile</h2>
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