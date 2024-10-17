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

[Please read the contributing guide.](https://github.com/arrlancore/minirule/blob/main/CONTRIBUTING.md)

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

### Breakdown:

1. Define Feature:
```sql
rule "Loyal Customer Reward"
define long_time_customer as
  customer.registration_date < "2020-01-01"
  and customer.total_purchases > 5000

when
  long_time_customer
  and customer.last_purchase > "2023-01-01"
then
  apply 10% discount to order.total
end
```

2. Or Logical Operator:
```sql
rule "Special Offer"
when
  customer.status is "gold"
  or customer.lifetime_value > 10000
then
  apply 15% discount to order.total
end
```

3. Not Operator:
```sql
rule "New Customer Offer"
when
  not customer.has_previous_purchase
  and order.total > 100
then
  apply 20% discount to order.total
end
```

4. Recently Time-based Condition:
```sql
rule "Re-engagement Offer"
when
  customer.last_purchase not recently (3 months)
  and customer.status is "active"
then
  send email "comeback_offer" to customer.email
end
```

5. In Operator with Array Literals:
```sql
rule "Premium Product Discount"
when
  product.category in ["electronics", "appliances"]
  and customer.status in ["gold", "platinum"]
then
  apply 12% discount to product.price
end
```

6. Has Used Condition:
```sql
rule "First-Time Promotion"
when
  not customer has used promotion "WELCOME2023"
  and order.total > 50
then
  apply 25% discount to order.total
  mark customer as used promotion "WELCOME2023"
end
```

7. Multiple Actions in Then Clause:
```sql
rule "VIP Customer Reward"
when
  customer.status is "vip"
  and order.total > 1000
then
  apply 20% discount to order.total
  add 500 points to customer.loyalty_account
  send email "vip_thank_you" to customer.email
end
```

8. Nested Conditions with Parentheses:
```sql
rule "Complex Seasonal Offer"
when
  (customer.status is "gold" or customer.lifetime_value > 5000)
  and (
    (order.total > 200 and order.item_count > 3)
    or (order.contains_category "seasonal" and order.total > 100)
  )
then
  apply 15% discount to order.total
  add 200 points to customer.loyalty_account
end
```

These enhanced capabilities will provide more flexibility and power in defining complex business rules.


### Task List
1. [ ] Implement 'Define' feature
   - Add 'Define' and 'As' keyword tokens
   - Implement 'define' clause in the parser
   - Implement visitor for 'define' clause in the interpreter
   - Add new keyword token to playground editor config

2. [ ] Add support for 'Or' logical operator
   - Add 'Or' keyword token
   - Extend parser to support 'Or' in conditions
   - Update interpreter to evaluate 'Or' conditions
   - Add new keyword token to playground editor config

3. [ ] Implement 'Not' operator
   - Add 'Not' keyword token
   - Extend 'condition' in parser to support 'not' operator
   - Implement 'not' operator evaluation in interpreter
   - Add new keyword token to playground editor config

4. [ ] Add 'Recently' time-based condition
   - Add 'Recently' keyword token
   - Add support for time unit tokens (e.g., 'months', 'days', 'years')
   - Implement 'recently' time-based condition in parser
   - Implement 'recently' time-based condition evaluation in interpreter
   - Add new keyword token to playground editor config

5. [ ] Implement 'In' operator with array literals
   - Add 'In' keyword token
   - Implement support for square bracket tokens
   - Extend 'condition' in parser to support 'in' operator with array literals
   - Implement 'in' operator evaluation with array literals in interpreter
   - Add new keyword token to playground editor config

6. [ ] Add 'Has Used' condition
   - Add 'Has' and 'Used' keyword tokens
   - Extend 'condition' in parser to support 'has used' syntax
   - Implement 'has used' condition evaluation in interpreter
   - Add new keyword token to playground editor config

7. [ ] Enhance 'Then' clause for multiple actions
   - Add 'Add', 'Points', 'Send', 'Email', 'Mark' keyword tokens
   - Extend 'thenClause' in parser to support multiple actions
   - Implement new action executions in interpreter (add points, send email, mark as used)
   - Add new keyword token to playground editor config

8. [ ] Support nested conditions with parentheses
   - Implement support for parentheses tokens
   - Extend 'whenClause' in parser to support nested conditions with parentheses
   - Extend condition evaluation in interpreter to support nested conditions
   - Add new keyword token to playground editor config

9. [ ] Testing
   - Initiate Unit Testing for minirule-language
   - Initiate Unit Testing for minirule-playground

## License

Minirule is open-source software licensed under the MIT License.

