<?php include 'components/sidebar.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>

<?php
include_once __DIR__ . '/freelancer_accepted_quests.php';
?>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-image: url('assets/background.jpg');
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  color: white;
  position: relative;
  min-height: 100vh;
}

<style>
.accepted-quests {
  padding: 2rem;
  color: #fff;
}
.accepted-quests h2 {
  margin-bottom: 1rem;
  font-size: 1.8rem;
}
.quest-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
.quest-box {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 1rem 1.5rem;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  transition: transform 0.2s;
}
.quest-box:hover {
  transform: translateY(-5px);
}
.quest-box h3 {
  margin-top: 0;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}
.quest-box p {
  margin: 0.3rem 0;
}
</style>

</body>
</html>