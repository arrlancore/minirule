# Minirule

Simple, readable business rule language for easy definition and interpretation.

## Features

- **Readable Syntax**: Minirule uses a human-friendly syntax that makes it easy to define business rules. This allows non-technical stakeholders to understand and contribute to the rule definitions.

- **Dynamic Business Terms**: The library supports dynamic business terms, enabling you to define rules with terms like `DISCOUNT`, `BONUS`, and more. This flexibility allows you to adapt to changing business needs without modifying the core logic.

- **Validation and Interpretation**: Minirule provides built-in validation and interpretation capabilities. You can ensure that your rules are syntactically correct and interpret them to derive actionable insights.

## Getting Started

### Installation

To use Minirule in your project, install it via npm:

```bash
npm install minirule
# or
yarn add minirule
```

### Usage

Here's a quick example of how you can define and interpret a business rule using Minirule:

```typescript
import { interpreter } from "minirule";

const rule = `
rule "New Customer Welcome"
when
  customer.registrationDate is between "2023-01-01" and "2023-12-31"
  and customer.orderCount < 3
  and order.total > 100
then
  apply 15% discount to order.total
end
`;

try {
  const result = interpreter.interpret(rule);
  console.log("Interpreted Rule:", result);
} catch (error) {
  console.error("Error interpreting rule:", error);
}
```

### Playground

For a hands-on experience, visit our [Minirule Playground](https://minirule.vercel.app/) where you can write, validate, and interpret your business rules in real-time. The playground provides an interactive environment to experiment with Minirule without any setup.

## Benefits

- **No Programming Required**: Minirule is designed for business users. You don't need to be a programmer to define and manage your business rules.

- **Collaboration**: The readable syntax allows for easy sharing and discussion of rules among team members, even in non-technical channels like Slack.

- **Adaptability**: Easily adapt to new business requirements by defining new terms and rules without changing the underlying code.

## Contributing

We welcome contributions to the Minirule library! If you have ideas for improvements or new features, feel free to open an issue or submit a pull request.

### Coming Soon
We will add more capability as the following:
```sql
rule "Loyal Customer Reward"

# Define reusable conditions
define long_time_customer as
  customer.registration_date < "2020-01-01"
  and customer.total_purchases > 5000

when
  long_time_customer
  and (
    customer.last_purchase not recently (3 months)
    or customer.cart_total > 1000
  )
  and customer.status in ["gold", "platinum"]
  and not customer has used promotion "COMEBACK2023"

then
  apply 20% discount to cart.total
  add 500 points to customer.loyalty_account
  send email "loyal_customer_offer" to customer.email
  mark customer as used promotion "COMEBACK2023"

end
```

## License

Minirule is open-source software licensed under the MIT License.

