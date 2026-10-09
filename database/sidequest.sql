-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 19, 2025 at 09:14 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sidequest`
--

-- --------------------------------------------------------

--
-- Table structure for table `businesses`
--

CREATE TABLE `businesses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `business_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `freelancers`
--

CREATE TABLE `freelancers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `middlename` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `freelancers`
--

INSERT INTO `freelancers` (`id`, `user_id`, `firstname`, `middlename`, `lastname`, `phone`, `dob`, `address`, `created_at`) VALUES
(2, 26, 'Admin', 'Admin', 'Admin', '00000000000', '2025-07-18', 'Admin Hotel', '2025-07-17 16:30:26');

-- --------------------------------------------------------

--
-- Table structure for table `individual_clients`
--

CREATE TABLE `individual_clients` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `middlename` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `individual_clients`
--

INSERT INTO `individual_clients` (`id`, `user_id`, `firstname`, `middlename`, `lastname`, `phone`, `dob`, `address`, `created_at`) VALUES
(3, 27, 'Admin', 'Admin', 'Admin', '00000000000', '2025-07-18', 'Admin Hotel', '2025-07-17 16:31:16'),
(4, 28, 'Jimiel', 'Dinio', 'Balitayo', '09951534133', '2004-04-12', '22 Valdefuente - Fortaleza Rd, Brgy. Cruz Roja, Purok 3\r\nHouse no. 254', '2025-07-19 19:10:31');

-- --------------------------------------------------------

--
-- Table structure for table `quests`
--

CREATE TABLE `quests` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `posted_by` int(11) DEFAULT NULL,
  `deadline` date NOT NULL,
  `status` enum('open','in_progress','completed') DEFAULT 'open',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `reward` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quests`
--

INSERT INTO `quests` (`id`, `title`, `description`, `posted_by`, `deadline`, `status`, `created_at`, `reward`) VALUES
(8, 'I need homework help!', 'What\'s the powerhouse of the cell?\r\nSend me anything! pdf or pictures.\r\nThanks!', 27, '2025-07-22', 'open', '2025-07-19 09:30:43', 50.00),
(10, 'I need someone to draw!', 'Ill send you the details! Email me!', 27, '2025-07-30', 'open', '2025-07-19 18:15:33', 4000.00),
(11, 'I need someone to edit!', 'Ill email you the details!', 27, '2025-07-29', 'open', '2025-07-19 18:22:11', 2077.00),
(12, 'Can someone draw Space Urchin Fanart?', 'Contact me in email and ill send references!', 28, '2025-07-21', 'open', '2025-07-19 19:11:22', 1000.00);

-- --------------------------------------------------------

--
-- Table structure for table `quest_assignments`
--

CREATE TABLE `quest_assignments` (
  `id` int(11) NOT NULL,
  `quest_id` int(11) NOT NULL,
  `freelancer_id` int(11) NOT NULL,
  `accepted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('accepted','in_progress','completed') DEFAULT 'accepted',
  `proof_file` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quest_assignments`
--

INSERT INTO `quest_assignments` (`id`, `quest_id`, `freelancer_id`, `accepted_at`, `status`, `proof_file`) VALUES
(8, 8, 26, '2025-07-19 09:41:57', 'completed', 'uploads/687be56e61c4f_Answer.png'),
(10, 10, 26, '2025-07-19 18:20:18', 'completed', 'uploads/687bec757fd1c_Descender Suit Poster.png');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('client','freelancer') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role`, `created_at`) VALUES
(26, 'Admin', 'Admin@Admin.com', '$2y$10$BMC/WwjfzMjYYbjedPrdPeQI9t5SVaRzXuO0BCQbYYJpoLnaYBib6', 'freelancer', '2025-07-17 16:30:26'),
(27, 'ClientAdmin', 'Admin@AdminClient.com', '$2y$10$5uuO9/7KLf73eXqNPkXwSO7shAEibZIiZuXnhklM5UD/K.OSjtNPq', 'client', '2025-07-17 16:31:16'),
(28, 'Noclipper', 'jimielbalitayo9@gmail.com', '$2y$10$YN4hdhLELhXtpIujuH53WeSEu52eTniadBOuDIwxIQrLu0m/WcqXS', 'client', '2025-07-19 19:10:31');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `businesses`
--
ALTER TABLE `businesses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `freelancers`
--
ALTER TABLE `freelancers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `individual_clients`
--
ALTER TABLE `individual_clients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `quests`
--
ALTER TABLE `quests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `posted_by` (`posted_by`);

--
-- Indexes for table `quest_assignments`
--
ALTER TABLE `quest_assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quest_id` (`quest_id`),
  ADD KEY `freelancer_id` (`freelancer_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `businesses`
--
ALTER TABLE `businesses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `freelancers`
--
ALTER TABLE `freelancers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `individual_clients`
--
ALTER TABLE `individual_clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `quests`
--
ALTER TABLE `quests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `quest_assignments`
--
ALTER TABLE `quest_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `businesses`
--
ALTER TABLE `businesses`
  ADD CONSTRAINT `businesses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `freelancers`
--
ALTER TABLE `freelancers`
  ADD CONSTRAINT `freelancers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `individual_clients`
--
ALTER TABLE `individual_clients`
  ADD CONSTRAINT `individual_clients_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quests`
--
ALTER TABLE `quests`
  ADD CONSTRAINT `quests_ibfk_1` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `quest_assignments`
--
ALTER TABLE `quest_assignments`
  ADD CONSTRAINT `quest_assignments_ibfk_1` FOREIGN KEY (`quest_id`) REFERENCES `quests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quest_assignments_ibfk_2` FOREIGN KEY (`freelancer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
