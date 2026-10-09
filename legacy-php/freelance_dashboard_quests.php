<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
include_once __DIR__ . '/db.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'freelancer') {
    header("Location: login.php");
    exit;
}

$freelancer_id = $_SESSION['user_id'];

// Handle quest acceptance
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['accept_quest_id'])) {
    $quest_id = intval($_POST['accept_quest_id']);

    $stmt = $conn->prepare("SELECT id FROM quest_assignments WHERE quest_id = ?");
    $stmt->bind_param("i", $quest_id);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 0) {
        $stmt->close();
        // Add created_at column to quest_assignments table if it doesn't exist
        // ALTER TABLE quest_assignments ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        $assign = $conn->prepare("INSERT INTO quest_assignments (quest_id, freelancer_id, status, created_at) VALUES (?, ?, 'accepted', NOW())");
        $assign->bind_param("ii", $quest_id, $freelancer_id);
        $assign->execute();
        $assign->close();
        echo "<script>alert('Quest accepted!'); window.location.href = 'freelance_dashboard.php';</script>";
    } else {
        echo "<script>alert('This quest has already been accepted.'); window.location.href = 'freelance_dashboard.php';</script>";
    }
}

$quests = [];
$stmt = $conn->prepare("SELECT q.id, q.title, q.description, q.reward, q.deadline, q.created_at, u.username AS poster
    FROM quests q
    JOIN users u ON q.posted_by = u.id
    WHERE q.id NOT IN (
        SELECT DISTINCT quest_id FROM quest_assignments WHERE freelancer_id = ?
    )
    ORDER BY q.created_at DESC");
$stmt->bind_param("i", $freelancer_id);
$stmt->execute();
$result = $stmt->get_result();
while ($row = $result->fetch_assoc()) {
    $quests[] = $row;
}
$stmt->close();
?>

<section class="quest-section">
  <h2>Available Quests</h2>
  <div class="quest-grid">
    <?php if (empty($quests)): ?>
      <p style="color: #c0c0c0;">No available quests at the moment. Check back later!</p>
    <?php else: ?>
      <?php foreach ($quests as $quest): ?>
        <div class="quest-card">
          <h3><?= htmlspecialchars($quest['title']) ?></h3>
          <p><?= nl2br(htmlspecialchars($quest['description'])) ?></p>
          <p><strong>Reward:</strong> ₱<?= number_format($quest['reward'], 2) ?></p>
          <p><strong>Deadline:</strong> <?= htmlspecialchars($quest['deadline']) ?></p>
          <p><strong>Posted By:</strong> <?= htmlspecialchars($quest['poster']) ?></p>
          <small>Posted on: <?= htmlspecialchars($quest['created_at']) ?></small>
          <form method="POST" style="margin-top: 10px;">
            <input type="hidden" name="accept_quest_id" value="<?= $quest['id'] ?>">
            <button type="submit" class="accept-btn">Accept Quest</button>
          </form>
        </div>
      <?php endforeach; ?>
    <?php endif; ?>
  </div>
</section>