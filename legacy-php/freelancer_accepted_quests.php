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

// Handle file upload and status update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['quest_id'], $_POST['new_status'])) {
    $quest_id = intval($_POST['quest_id']);
    $new_status = $_POST['new_status'];
    $uploadPath = '';

    if (!empty($_FILES['proof']['name'])) {
        $uploadDir = __DIR__ . '/uploads/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        $filename = basename($_FILES['proof']['name']);
        $uniqueFilename = uniqid() . '_' . $filename;
        $uploadPath = 'uploads/' . $uniqueFilename;
        if (!move_uploaded_file($_FILES['proof']['tmp_name'], __DIR__ . '/' . $uploadPath)) {
            echo "<script>alert('Failed to upload file.');</script>";
            $uploadPath = ''; // Clear path if upload fails
        }
    }

    if ($uploadPath) {
        $stmt = $conn->prepare("UPDATE quest_assignments SET status = ?, proof_file = ? WHERE quest_id = ? AND freelancer_id = ?");
        $stmt->bind_param("ssii", $new_status, $uploadPath, $quest_id, $freelancer_id);
    } else {
        $stmt = $conn->prepare("UPDATE quest_assignments SET status = ? WHERE quest_id = ? AND freelancer_id = ?");
        $stmt->bind_param("sii", $new_status, $quest_id, $freelancer_id);
    }

    if ($stmt->execute()) {
        echo "<script>alert('Quest status updated successfully!'); window.location.href = 'freelance_dashboard.php';</script>";
    } else {
        echo "<script>alert('Failed to update quest status.');</script>";
    }
    $stmt->close();
}

$accepted_quests = [];
$stmt = $conn->prepare("
    SELECT q.id, q.title, q.description, q.reward, q.deadline, qa.status, qa.proof_file, u.username AS poster, qa.created_at
    FROM quests q
    JOIN quest_assignments qa ON q.id = qa.quest_id
    JOIN users u ON q.posted_by = u.id
    WHERE qa.freelancer_id = ?
    ORDER BY qa.created_at DESC
");
$stmt->bind_param("i", $freelancer_id);
$stmt->execute();
$result = $stmt->get_result();
while ($row = $result->fetch_assoc()) {
    $accepted_quests[] = $row;
}
$stmt->close();
?>

<section class="quest-section">
  <h2>Your Accepted Quests</h2>
  <div class="quest-grid">
    <?php if (empty($accepted_quests)): ?>
      <p style="color: #c0c0c0;">You haven't accepted any quests yet.</p>
    <?php else: ?>
      <?php foreach ($accepted_quests as $quest): ?>
        <div class="quest-card">
          <h3><?= htmlspecialchars($quest['title']) ?></h3>
          <p><?= nl2br(htmlspecialchars($quest['description'])) ?></p>
          <p><strong>Reward:</strong> ₱<?= number_format($quest['reward'], 2) ?></p>
          <p><strong>Deadline:</strong> <?= htmlspecialchars($quest['deadline']) ?></p>
          <p><strong>Status:</strong> <?= htmlspecialchars(ucfirst(str_replace('_', ' ', $quest['status']))) ?></p>
          <?php if (!empty($quest['proof_file'])): ?>
            <p><a href="<?= htmlspecialchars($quest['proof_file']) ?>" target="_blank" style="color: #61dafb;">View Uploaded Proof</a></p>
          <?php else: ?>
            <p style="color: #888888;">No proof uploaded yet.</p>
          <?php endif; ?>
          <p><strong>Posted By:</strong> <?= htmlspecialchars($quest['poster']) ?></p>
          <small>Accepted on: <?= htmlspecialchars($quest['created_at']) ?></small>

          <form method="POST" enctype="multipart/form-data" style="margin-top: 10px;">
            <input type="hidden" name="quest_id" value="<?= $quest['id'] ?>">
            <select name="new_status" required>
              <option value="">-- Change Status --</option>
              <option value="accepted" <?= ($quest['status'] == 'accepted') ? 'selected' : '' ?>>Accepted</option>
              <option value="in_progress" <?= ($quest['status'] == 'in_progress') ? 'selected' : '' ?>>In Progress</option>
              <option value="completed" <?= ($quest['status'] == 'completed') ? 'selected' : '' ?>>Completed</option>
            </select>
            <label for="proof_<?= $quest['id'] ?>" style="display: block; margin-top: 10px; cursor: pointer; color: #61dafb;">
                Upload Proof (Optional)
            </label>
            <input type="file" name="proof" id="proof_<?= $quest['id'] ?>" accept="image/*,application/pdf" style="display: none;"/>
            <button type="submit" class="status-btn">Update Status</button>
          </form>
        </div>
      <?php endforeach; ?>
    <?php endif; ?>
  </div>
</section>