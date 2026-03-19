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
        - generic [ref=e18]:
          - generic [ref=e19]: Email
          - textbox "Email" [ref=e21]
        - generic [ref=e22]:
          - generic [ref=e23]: Password
          - generic [ref=e24]:
            - textbox "Password" [ref=e25]
            - button "Show password" [ref=e26] [cursor=pointer]:
              - img [ref=e27]
        - link "Forgot Password?" [ref=e31] [cursor=pointer]:
          - /url: /forgot-password
        - button "Sign in" [ref=e32] [cursor=pointer]
      - paragraph [ref=e33]:
        - text: New Lion?
        - link "Create your account" [ref=e34] [cursor=pointer]:
          - /url: /register
  - region "Notifications (F8)":
    - list
  - alert [ref=e35]
```