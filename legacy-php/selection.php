<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Select Role - SideQuest</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
      background-color: #1a1a1a;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #e0e0e0;
    }

    h1 {
      font-size: 2.5rem;
      margin-bottom: 40px;
      color: #f0f0f0;
      font-weight: 600;
    }

    .container {
      display: flex;
      gap: 40px;
    }

    .role-box {
      background-color: #282828;
      padding: 40px 60px;
      border-radius: 8px;
      width: 250px;
      height: 200px;
      text-align: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      transition: transform 0.3s ease, background-color 0.3s ease;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      border: 1px solid #444;
    }

    .role-box:hover {
      transform: translateY(-5px);
      background-color: #333;
    }

    .role-box h2 {
      font-size: 1.8rem;
      margin-bottom: 20px;
      color: #f0f0f0;
    }

    .role-box p {
      font-size: 1rem;
      color: #e0e0e0;
    }

    a {
      color: inherit;
      text-decoration: none;
    }
  </style>
</head>
<body>

  <h1>Choose Your Role</h1>
  <div class="container">
    <a href="freelancer_regis.php?role=freelancer">
      <div class="role-box">
        <h2>Freelancer</h2>
        <p>Join to find quests and earn rewards for your skills.</p>
      </div>
    </a>
    <a href="client_regis.php?role=client">
      <div class="role-box">
        <h2>Client</h2>
        <p>Register to post quests and manage your team.</p>
      </div>
    </a>
  </div>

</body>
</html>