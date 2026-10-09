<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
include_once __DIR__ . '/../db.php';
$user_id = $_SESSION['user_id'] ?? null;
$username = 'Client';

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
  <div class="profile">
    <div class="avatar-lg"></div>
    <p id="welcome-text" class="welcome-message"></p>
  </div>
  <nav class="nav-links">
    <a href="client_dashboard.php" class="active"><span>Posted Quests</span></a>
    <a href="#" onclick="document.getElementById('addQuestModal').style.display='block'; return false;"><span>Add Quest</span></a>
    <a href="client_profile.php"><span>Profile</span></a>
    <a href="logout.php"><span>Logout</span></a>
  </nav>
</aside>

<style>
.sidebar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #282828;
  padding:  10px 50px;
  color: #e0e0e0;
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.sidebar .profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.welcome-message {
  font-size: 1.4rem;
  font-weight: 600;
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

.nav-links a:hover {
  color: #f0f0f0;
}

.modal {
  display: none;
  position: fixed;
  z-index: 2000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.7);
}
.modal-content {
  background-color: #282828;
  color: #e0e0e0;
  margin: 5% auto;
  padding: 40px;
  border-radius: 8px;
  max-width: 500px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}
.modal-content .close {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 24px;
  cursor: pointer;
  color: #e0e0e0;
  transition: color 0.3s ease;
}
.modal-content .close:hover {
  color: #f0f0f0;
}
.modal-content input, .modal-content textarea {
  width: 100%;
  margin-bottom: 12px;
  padding: 14px 16px;
  border-radius: 6px;
  border: 1px solid #444;
  background-color: #333;
  color: #e0e0e0;
  box-sizing: border-box;
}
.modal-content button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  font-size: 1.05rem;
  font-weight: 600;
  transition: background-color 0.3s ease;
}
.modal-content button:hover {
  background-color: #88b649;
}
</style>

<script>
  const welcomeText = "Welcome <?= htmlspecialchars($username) ?>";
  let i = 0;
  const speed = 70;

  function typeWriter() {
    if (i < welcomeText.length) {
      document.getElementById("welcome-text").innerHTML += welcomeText.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  }

  window.onload = typeWriter;
</script>

<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit_quest'])) {
    include_once __DIR__ . '/../db.php';
    $client_id = $_SESSION['user_id'] ?? null;
    $quest_name = trim($_POST['quest_name']);
    $deadline = $_POST['deadline'];
    $description = trim($_POST['description']);
    $reward = floatval($_POST['reward']);

    if ($client_id && $quest_name && $deadline && $description && $reward > 0) {
        $stmt = $conn->prepare("INSERT INTO quests (title, description, posted_by, deadline, reward) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssisd", $quest_name, $description, $client_id, $deadline, $reward);
        $stmt->execute();
        $stmt->close();
        echo "<script>alert('Quest added successfully!');</script>";
    }
}
?>

<div id="addQuestModal" class="modal">
  <div class="modal-content">
    <span class="close" onclick="document.getElementById('addQuestModal').style.display='none'">&times;</span>
    <form method="POST">
      <h3>Add New Quest</h3>
      <input type="text" name="quest_name" placeholder="Quest Name" required>
      <input type="date" name="deadline" required>
      <textarea name="description" placeholder="Quest Description" rows="4" required></textarea>
      <input type="number" name="reward" step="0.01" placeholder="Financial Reward (₱)" required>
      <button type="submit" name="submit_quest">Submit</button>
    </form>
  </div>
</div>
