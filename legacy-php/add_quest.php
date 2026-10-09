<?php
session_start();
include_once __DIR__ . '/db.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'client') {
    header("Location: login.php");
    exit;
}

$user_id = $_SESSION['user_id'];

// Handle quest submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit_quest'])) {
    $quest_name = trim($_POST['quest_name']);
    $deadline = $_POST['deadline'];
    $description = trim($_POST['description']);
    $reward = floatval($_POST['reward']);

    if ($quest_name && $deadline && $description && $reward > 0) {
        $stmt = $conn->prepare("INSERT INTO quests (title, description, posted_by, deadline, reward) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssisd", $quest_name, $description, $user_id, $deadline, $reward);
        $stmt->execute();
        $stmt->close();
        echo "<script>alert('Quest added successfully!');</script>";
    }
}

// Fetch all posted quests by the client
$quests = [];
$stmt = $conn->prepare("SELECT id, title, description, deadline, reward FROM quests WHERE posted_by = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
while ($row = $result->fetch_assoc()) {
    $quests[] = $row;
}
$stmt->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Add Quest</title>
  <style>
    body {
      background-color: #1A1A1A;
      font-family: Arial, sans-serif;
      color: white;
      margin: 0;
      padding: 2rem;
    }
    .quest-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }
    .quest-card {
      background: rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 1rem;
      cursor: pointer;
      transition: 0.2s;
    }
    .quest-card:hover {
      background: rgba(255,255,255,0.15);
      transform: translateY(-5px);
    }
    .modal {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
    }
    .modal-content {
      background-color: #fff;
      color: #000;
      margin: 5% auto;
      padding: 20px;
      border-radius: 10px;
      max-width: 500px;
      position: relative;
    }
    .modal-content .close {
      position: absolute;
      top: 10px;
      right: 20px;
      font-size: 24px;
      cursor: pointer;
    }
    .modal-content input, .modal-content textarea {
      width: 100%;
      margin-bottom: 12px;
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #ccc;
    }
    .modal-content button {
      background-color: crimson;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
    }
  </style>
</head>
<body>

<h2>Add and View Your Quests</h2>
<button onclick="document.getElementById('addQuestModal').style.display='block'">➕ Add Quest</button>

<!-- Add Quest Modal -->
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

<!-- Quest Cards and Modals -->
<div class="quest-grid">
<?php foreach ($quests as $quest): ?>
  <div class="quest-card" onclick="openModal(<?= $quest['id'] ?>)">
    <h3><?= htmlspecialchars($quest['title']) ?></h3>
    <p><strong>Deadline:</strong> <?= htmlspecialchars($quest['deadline']) ?></p>
    <p><strong>Reward:</strong> ₱<?= number_format($quest['reward'], 2) ?></p>
  </div>

  <!-- Modal per Quest -->
  <div id="modal-<?= $quest['id'] ?>" class="modal">
    <div class="modal-content">
      <span class="close" onclick="closeModal(<?= $quest['id'] ?>)">&times;</span>
      <h3><?= htmlspecialchars($quest['title']) ?></h3>
      <p><strong>Description:</strong> <?= nl2br(htmlspecialchars($quest['description'])) ?></p>
      <p><strong>Deadline:</strong> <?= htmlspecialchars($quest['deadline']) ?></p>
      <p><strong>Reward:</strong> ₱<?= number_format($quest['reward'], 2) ?></p>
    </div>
  </div>
<?php endforeach; ?>
</div>

<script>
function openModal(id) {
  document.getElementById("modal-" + id).style.display = "block";
}
function closeModal(id) {
  document.getElementById("modal-" + id).style.display = "none";
}
window.onclick = function(event) {
  document.querySelectorAll('.modal').forEach(modal => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
}
</script>

</body>
</html>
