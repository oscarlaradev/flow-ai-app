export const EXAMPLE_FLOWS = [
  {
    id: "purchase-flow",
    name: "Purchase Flow",
    content: `// Online Purchase Process
START: Customer visits website

(Browse products)
- Customer searches and filters items.

(Select an item)

<Is product in stock?>
  [Yes] -> (Add to cart)
    -> [/View cart and proceed to payment/]
    -> <Is user registered?>
      [Yes] -> (Validate session)
        -> (Confirm order)
      [No] -> [/Create account or checkout as guest/]
        -> (Confirm order)
    -> (Confirm order)
    -> [[Generate invoice]]
    -> END: Successful purchase
  [No] -> (Display 'Out of stock' message)
    -> (Suggest similar products)
    -> (Browse products)`,
  },
  {
    id: "login-flow",
    name: "Login Flow",
    content: `// User Authentication
START: User navigates to login page

[/User enters credentials (email, password)/]

(Submit form)

<Are credentials valid?>
  [Yes] -> (Create session token)
    -> (Redirect to dashboard)
    -> END: Login successful
  [No] -> (Display error message)
    -> [/User enters credentials (email, password)/]`,
  },
  {
    id: "error-handling",
    name: "Error Handling",
    content: `// API Request Error Handling
START: Make API request

(Request sent to server)

<Did request succeed?>
  [Yes] -> (Process response data)
    -> END: Process complete
  [No] -> <Is it a network error?>
    [Yes] -> (Retry request after 5 seconds)
      -> START
    [No] -> (Log error to monitoring service)
      -> (Display generic error message to user)
      -> END: Process failed`,
  },
];
