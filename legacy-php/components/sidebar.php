<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
include_once __DIR__ . '/../db.php';

$user_id = $_SESSION['user_id'] ?? null;
$username = 'User';

if ($user_id) {
    $stmt = $conn->prepare("SELECT username FROM users WHERE id = ?");
    if ($stmt) {
        $stmt->bind_param("i", $user_id);
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            if ($row = $result->fetch_assoc()) {
                $username = $row['username'];
            }
        }
    }
}
?>
<aside class="sidebar">
  <div class="left-section">
    <p class="welcome-message">Welcome <?= htmlspecialchars($username) ?></p>
  </div>

  <nav class="nav-links">
    <a href="freelance_dashboard.php" class="active"><span>Questboard</span></a>
<a href="<?= $_SESSION['role'] === 'client' ? 'client_profile.php' : 'profile.php' ?>">
  <span>Profile</span>
</a>
    <a href="logout.php"><span>Logout</span></a>
  </nav>
</aside>

<style>
.sidebar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  padding: 10px 50px;
  background-color: rgba(42, 42, 42, 1);
  background-size: cover;
  background-position: center;
  box-sizing: border-box;
  color: white;
  z-index: 999;
}

.left-section {
  flex: 1;
}

.welcome-message {
      font-size: 1.4rem;
      padding-left: 40px;
      font-weight: 550;
      color: #f0f0f0;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links a {
  text-decoration: none;
  color: #e0e0e0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.3s ease;
}

.nav-links a:hover,
.nav-links a.active {
  background-color: #333333;
  color: #ffffff;
}

.nav-links a .icon {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .sidebar {
    flex-direction: column;
    height: auto;
    padding: 15px;
    gap: 15px;
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }

  .nav-links a {
    justify-content: center;
    padding: 10px;
  }

  .left-section {
    text-align: center;
  }
}
</style>
