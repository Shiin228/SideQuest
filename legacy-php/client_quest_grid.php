<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
include_once __DIR__ . '/db.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'client') {
    header("Location: login.php");
    exit;
}

$client_id = $_SESSION['user_id'];
$quests = [];

$stmt = $conn->prepare("
    SELECT q.id, q.title, q.description, q.reward, q.deadline, q.created_at, qa.status, qa.proof_file, u.username AS freelancer
    FROM quests q
    LEFT JOIN quest_assignments qa ON q.id = qa.quest_id
    LEFT JOIN users u ON qa.freelancer_id = u.id
    WHERE q.posted_by = ?
    ORDER BY q.created_at DESC
");
$stmt->bind_param("i", $client_id);
$stmt->execute();
$result = $stmt->get_result();
while ($row = $result->fetch_assoc()) {
    $quests[] = $row;
}
$stmt->close();
?>

<section class="quest-section">
  <h2>Your Posted Quests</h2>
  <div class="quest-grid">
    <?php foreach ($quests as $quest): ?>
      <div class="quest-card">
        <h3><?= htmlspecialchars($quest['title']) ?></h3>
        <p><?= nl2br(htmlspecialchars($quest['description'])) ?></p>
        <p><strong>Reward:</strong> ₱<?= number_format($quest['reward'], 2) ?></p>
        <p><strong>Deadline:</strong> <?= htmlspecialchars($quest['deadline']) ?></p>
        <p><strong>Status:</strong> <?= htmlspecialchars($quest['status'] ?? 'Not Assigned') ?></p>
        <p><strong>Freelancer:</strong> <?= htmlspecialchars($quest['freelancer'] ?? 'N/A') ?></p>
        <?php if (!empty($quest['proof_file'])): ?>
          <p><a href="<?= htmlspecialchars($quest['proof_file']) ?>" target="_blank" style="color:#6dc2ff;">📎 View Uploaded Proof</a></p>
        <?php else: ?>
          <p><em>No proof uploaded yet.</em></p>
        <?php endif; ?>
      </div>
    <?php endforeach; ?>
  </div>
</section>

<style>
.quest-section {
  padding: 2rem;
}
.quest-section h2 {
  color: #f0f0f0;
  font-size: 1.8rem;
  margin-bottom: 1rem;
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
  padding: 1rem;
  color: #e0e0e0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  transition: 0.2s ease;
}
.quest-card:hover {
  transform: translateY(-5px);
  background-color: #333;
}
</style>