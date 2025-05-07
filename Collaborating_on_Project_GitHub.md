
# 📦 Collaborating Your Completed Task to the Project (GitHub Workflow)

Once you've completed your assigned task, follow the steps below to integrate your work into the main project repository:

## ✅ Step 1: Commit Your Changes Locally
Ensure your changes are saved and committed on your local branch.

```bash
git status
git add .
git commit -m "Completed: [Brief task description]"
```

## ✅ Step 2: Push Your Branch to GitHub

```bash
git push origin your-branch-name
```

## ✅ Step 3: Open a Pull Request (PR)
1. Go to the project repository on GitHub.
2. Click **"Compare & pull request"** next to your pushed branch.
3. Fill in the title and description:
   - **Title:** Clear and concise summary of the task.
   - **Description:** Include what was done, any assumptions, and notes for reviewers.

**Example:**
```
Title: Added validation for user input

Description:
- Implemented input validation for the registration form.
- Used Yup schema for form validation.
- All unit tests passed.
- Ready for review.
```

4. Submit the PR for review.

## ✅ Step 4: Collaborate and Respond to Feedback
- Monitor your PR for comments.
- Make any requested changes and push updates to the same branch.
- Your team lead or reviewer will merge the PR when approved.

---

## 🔁 Optional: Sync with Main Branch (Recommended)
If the main branch has changed since you started:

```bash
git checkout main
git pull origin main
git checkout your-branch-name
git rebase main  # or use `git merge main`
```

---

**Note:** Always keep your branch focused on a single task to maintain clean collaboration.
