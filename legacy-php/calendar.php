<?php include 'components/sidebar.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    

<section class="calendar-section">
  <h2>📅 Quest Calendar</h2>
  <div class="calendar-container">
    <iframe src="https://calendar.google.com/calendar/embed?src=en.philippines%23holiday%40group.v.calendar.google.com&ctz=Asia%2FManila" style="border: 0" width="100%" height="600" frameborder="0" scrolling="no"></iframe>
  </div>
</section>

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
.calendar-section {
  padding: 2rem;
}
.calendar-section h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}
.calendar-container {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.2);
}
</style>

</body>
</html>