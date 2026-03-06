Goal Tracker

[ View Live Demo](https://goal-tracker-alpha-seven.vercel.app/) | [ View Video Demo]() |  [ View Code on GitHub](https://github.com/setayeshazizi/goal-tracker)

   Goal Tracker is a multi page React web application designed to help users create and manage goals, track their progress, and visualize achievements through an interactive dashboard. It provides features such as progress tracking, categories, streak monitoring, and a responsive user interface.
   

 📊Features:
 
  1: Dashboard Features:
  
    1️⃣ Goal Management
    
        Create new goals
        Edit existing goals
        Delete goals
        Pause goals
        Mark progress on goals
     
       
    2️⃣ Active Goals Display

        Goals are displayed as interactive cards
        Each card shows:
        Goal title
        Progress bar
        Goal details - Start/End Date - Start/End Time - Notes - Target - Type - Category - Unit - Priority
        Action buttons:
        Edit - Delete - Pause - Mark Progress  
      
       
    3️⃣ Goal Actions

       New Goal Button → Opens the form to create a new goal
       Export Button → Export all goals as a JSON file
    
      
    4️⃣ XP & Level System

         Users earn XP based on their activity and goal progress.

        
    5️⃣ User Streak Tracking

         Tracks how many consecutive days a user logs progress.
         

    6️⃣ Completed Goals Archive

         Completed goals appear as titles in the dashboard archive section
         Full details are available in the Archive page
       
    
    7️⃣ Live Time & Date Card

         Displays live date and time
         Automatically adjusts based on the user’s timezone
        
         
    8️⃣ Overall Progress

          Shows the overall progress percentage based on all goals combined.

      
    9️⃣ Recent Activities

          Displays a list of the user’s latest progress logs.

         
    🔟 Goal Statistics

         Shows:
             Total number of goals
             Number of active goals

______________________________________________________________________________________________________________________

  Team Contributions:

  This project was developed collaboratively by:

  Satayesh Esmaeily  
  - Implemented the Dashboard page and Categories pages.  
  - Created Login page and Archive page.  
  - Added Splash/loading screen for page load.

  Setayesh Azizi  
  - Implemented the Goals page and Settings page.  
  - Added Firebase cloud database integration and charts(Recharts).  
  - Implemented Export feature to download goals as JSON.

    ______________________________________________________________________________________________________________________

  2: Goal Page Features:
  

      1️⃣ Goal Actions

         New Goal Button → Opens the form to create a new goal
         Export Button → Export all goals as a JSON file

      2️⃣ Goal Summary

         Total number of goals
         Number of Active, Paused, and Completed goals
         Avg Progress: Overall progress percentage of all goals

      3️⃣ Filtering & Sorting

         Filter by: All / Active / Paused / Completed
         Sort by: Newest / Progress % / Category

      4️⃣ Search

         Search goals by title using a search bar

      5️⃣ Goal Display

         Goals are displayed with all details from the Dashboard page, including:
            Progress bars
            Action buttons (Edit, Delete, Pause, Mark Progress)

   ______________________________________________________________________________________________________________________

  3: Category Page Features:

     1️⃣ Category Summary

       Total number of categories
       Number of Active categories
       Number of Completed categories
       Overall Progress: Overall percentage progress across all categories

    2️⃣ Charts & Visualization

      Use of charts and graphs for:
      Progress Share (how each category contributes to total progress)
      Progress Comparison between categories

    3️⃣ Highlighted Categories

       Display Top Category (highest progress or importance)
       Display Categories that need attention

    4️⃣ Filtering & Sorting & Search bar

       Filter by: All / Active / Completed / Need Attention
       Sort by: High → Low / Low → High / Most First / Name A → Z

    5️⃣ Category Cards

        Each category displayed as a card showing:
        Number of goals in the category
        Number of Active and Completed goals in the category
        Progress % of goals in that category
  
   ______________________________________________________________________________________________________________________

   4: Archive Page Features:

     1️⃣ Archive Summary
 
       Total number of archived goals
       Number of Completed goals
       Number of Deleted goals
       Number of goals eligible for restore

     2️⃣ Filtering, Sorting & Search

       Filter by: All / Completed / Deleted
       Sort by relevant criteria (e.g., date, progress)
       Search goals by title

     3️⃣ Completed Goals

       Display completed goals with:
       Option to Restore to Active
       Completion date & time

     4️⃣ Deleted Goals
 
      Display deleted goals with:
      Option to Restore
      Deletion date & time

   ______________________________________________________________________________________________________________________

  5: Goal Form Page/Edit Form Page:

     1️⃣ Structured Goal Form

          To create a new goal, the form includes two types of fields:
          🔴 Required Fields
            These fields must be filled in order to create a goal:
             Title
             Type
             Category
             Target
             Unit
             Priority 
             Deadline 
             Start Date 
             End Date

         🟡 Optional Fields 
           These fields are optional and allow users to customize their goals:
             Frequency
             Progress Bar Color
             Start Time 
             End Time 
             Notes 
 ______________________________________________________________________________________________________________________

   6: Settings Page:
    
        1️⃣ Language & Theme

            Change the application language
            Switch or customize the theme

        2️⃣ Profile Settings

            Edit the user profile (demo/fake profile information)

        3️⃣ Theme Customization

            Change the theme color
            Personalize the appearance of the interface

        4️⃣ Preferences

            Manage user preferences and application behavior
            Customize certain UI and experience settings

        5️⃣ Danger Zone

           A special section for resetting application data
           Allows users to clear or reset stored data when needed
  ______________________________________________________________________________________________________________________

   7: Fake Login Page:

     Fake Login Page
       The application includes a demo login page to simulate user authentication.
        Login Form Fields
           The login form contains the following fields:
           Full Name – User's full name
           Email – User email address
           Password – User password
           Main Focus (Dropdown) – User's main focus area:
           Study
           Work
           Personal
           Health
   ______________________________________________________________________________________________________________________

   8: Navigation Bar Features
   
       The application includes a navigation bar that provides quick access to important actions and tools.
          Quick Access Tools
             Theme Toggle – Switch between Light Mode and Dark Mode
             Language Switcher – Change the language between English and Persian
          External Access
             GitHub Icon – Links directly to the project's GitHub repository
          Search
             A global search bar that allows users to quickly search within the application.
          Branding
              Displays the application name and logo for clear branding and identity.

  ______________________________________________________________________________________________________________________

  How to run:
  
      1. Navigate to the Folder 
      cd goaltracker
      2. Install dependencies
      npm install (i)
      3. Run the Project
      npm run dev 
      and open the localhost on your browser
  ______________________________________________________________________________________________________________________

  Language & Direction Support (RTL / LTR)

      The application supports both Left-to-Right (LTR) and Right-to-Left (RTL) languages to provide a better experience for       different users.
      Supported Languages
         English (LTR)
         Persian / Farsi (RTL)
      Automatic Layout Direction
      When the user changes the language, the layout direction automatically adjusts:
         English → LTR layout
         Persian → RTL layout
      This ensures that:
        Text alignment - UI components - Navigation flow
        all adapt correctly to the selected language.
 ______________________________________________________________________________________________________________________

 ⭐ XP & Streak System

    The app uses a gamified system where users earn XP from progress logs and completed goals, plus a streak bonus for           consistency.
    XP Rules
     - Every progress log starts with a base of **10 XP**.
     - XP per log is scaled by:
     - **Priority multiplier**: `low=1`, `medium=1.2`, `high=1.5`
     - **Type multiplier**: `daily=1`, `count=1.1`, `time=1.2`
     - Formula:
     - `xpPerLog = round(10 × priorityMultiplier × typeMultiplier)`
     - Goal log XP:
     - `goalLogXp = xpPerLog × numberOfLogs`
     - Important:
     - XP depends on the **number of logs**, not the `amount` value inside each log.

    Completion XP
     - If a goal is completed: **+50 XP**
     - If completed on or before deadline: **+20 XP** extra

    **Streak Rules**
      - Streak is based on unique activity days across logged progress.
      - Consecutive logged days increase streak.
      - Streak becomes `0` only if the latest activity is **more than 1 day** behind today.
      - (So a 1-day gap is still tolerated in this implementation.)

    **Streak Bonus**
      - `3+ days` → `+5 XP`
      - `7+ days` → `+10 XP`
      - `14+ days` → `+20 XP`

    **Total XP and Level**
     - `xpTotal = logsXp + completionXp + streakBonus`
     - `level = floor(sqrt(xpTotal / 100)) + 1`
 
  ______________________________________________________________________________________________________________________
  
Screenshots:

1. ![image alt](https://github.com/Satayesh-Esmaily/Goal-Tracker-/blob/6f4eff1e74de1fa5c8c2509c418b1541d9e11f4c/goaltracker/src/readme%20images/photo_2026-03-05_14-26-03.jpg)
2. ![image alt](https://github.com/Satayesh-Esmaily/Goal-Tracker-/blob/d06201d6caff8cfeed98ee801e0fffcfc0e66347/goaltracker/src/readme%20images/photo_2026-03-05_14-26-52.jpg)
3. ![image alt](https://github.com/Satayesh-Esmaily/Goal-Tracker-/blob/d06201d6caff8cfeed98ee801e0fffcfc0e66347/goaltracker/src/readme%20images/photo_2026-03-05_16-51-03.jpg)
4. ![image alt](https://github.com/Satayesh-Esmaily/Goal-Tracker-/blob/d06201d6caff8cfeed98ee801e0fffcfc0e66347/goaltracker/src/readme%20images/photo_2026-03-05_16-51-10.jpg)
5. ![image alt](https://github.com/Satayesh-Esmaily/Goal-Tracker-/blob/d06201d6caff8cfeed98ee801e0fffcfc0e66347/goaltracker/src/readme%20images/photo_2026-03-05_16-51-17.jpg)
6. ![image alt](https://github.com/Satayesh-Esmaily/Goal-Tracker-/blob/d06201d6caff8cfeed98ee801e0fffcfc0e66347/goaltracker/src/readme%20images/photo_2026-03-05_16-51-27.jpg)
7. ![image alt](https://github.com/Satayesh-Esmaily/Goal-Tracker-/blob/d06201d6caff8cfeed98ee801e0fffcfc0e66347/goaltracker/src/readme%20images/photo_2026-03-05_16-51-36.jpg)
8. ![image alt](https://github.com/Satayesh-Esmaily/Goal-Tracker-/blob/d06201d6caff8cfeed98ee801e0fffcfc0e66347/goaltracker/src/readme%20images/photo_2026-03-05_16-51-43.jpg)
9. ![image alt](https://github.com/Satayesh-Esmaily/Goal-Tracker-/blob/main/goaltracker/src/readme%20images/photodetails_2026-03-06_18-15-19.jpg)
10. ![image alt](https://github.com/Satayesh-Esmaily/Goal-Tracker-/blob/main/goaltracker/src/readme%20images/photo1_2026-03-06_18-15-48.jpg)

11.![image alt](https://github.com/Satayesh-Esmaily/Goal-Tracker-/blob/main/goaltracker/src/readme%20images/notfound_2026-03-06_17-07-35.jpg)
