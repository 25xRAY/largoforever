# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to content" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - generic [ref=e3]:
    - img [ref=e4]:
      - generic [ref=e6]: "26"
    - generic [ref=e7]:
      - generic [ref=e8]:
        - heading "Welcome Back, Lion 🦁" [level=1] [ref=e9]
        - paragraph [ref=e10]: Sign in to track your graduation and celebrate your wins.
      - button "Sign in with Google" [ref=e11] [cursor=pointer]
      - generic [ref=e16]: or sign in with email
      - generic [ref=e17]:
        - alert [ref=e18]: Invalid email or password.
        - generic [ref=e19]:
          - generic [ref=e20]: Email
          - textbox "Email" [ref=e22]: admin@largolions2026.org
        - generic [ref=e23]:
          - generic [ref=e24]: Password
          - generic [ref=e25]:
            - textbox "Password" [ref=e26]: ChangeMe123!
            - button "Show password" [ref=e27] [cursor=pointer]:
              - img [ref=e28]
        - link "Forgot Password?" [ref=e32] [cursor=pointer]:
          - /url: /forgot-password
        - button "Sign in" [ref=e33] [cursor=pointer]
      - paragraph [ref=e34]:
        - text: New Lion?
        - link "Create your account" [ref=e35] [cursor=pointer]:
          - /url: /register
  - region "Notifications (F8)":
    - list
  - alert [ref=e36]
```