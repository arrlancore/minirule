# Minirule Examples

This directory contains example `.minirule` files demonstrating various features and use cases of the Minirule language.

## Files

### comprehensive-example.minirule

A complete showcase of all currently supported Minirule features:

- ✅ **DEFINE keyword** - Create reusable business terms
- ✅ **OR operator** - Logical OR conditions
- ✅ **AND operator** - Logical AND conditions
- ✅ **BETWEEN** - Range checks
- ✅ **Comparison operators** - `>`, `<`, `IS`
- ✅ **Business terms** - `DISCOUNT`, `BONUS`, `FEE`
- ✅ **Complex logic** - Nested AND/OR conditions with proper precedence

## Current Features

### 1. DEFINE - Reusable Terms

Define constants or business terms that can be referenced throughout your rules:

```minirule
DEFINE premium_threshold AS 5000
DEFINE gold_status AS "gold"

RULE "Premium Discount"
WHEN customer.lifetime_value > premium_threshold
  AND customer.status IS gold_status
THEN apply 15% discount TO order.total
END
```

### 2. Logical Operators (AND, OR)

Combine conditions with logical operators. **Important**: AND has higher precedence than OR.

```minirule
// This evaluates as: (A AND B) OR (C AND D)
RULE "Multi-Condition"
WHEN condition_A
  AND condition_B
  OR condition_C
  AND condition_D
THEN apply 10% discount TO order.total
END
```

### 3. Comparison Operators

- `IS` - Equality check
- `>` - Greater than
- `<` - Less than
- `BETWEEN` - Range check (inclusive)

```minirule
RULE "Range Example"
WHEN customer.age IS BETWEEN "18" AND "65"
  AND order.total > 100
  AND order.items < 50
THEN apply 5% discount TO order.total
END
```

### 4. Business Terms

Apply different types of actions:
- `DISCOUNT` - Reduce value
- `BONUS` - Add value (typically for points/rewards)
- `FEE` - Add charges

```minirule
RULE "Discount Example"
WHEN customer.vip IS "yes"
THEN apply 20% discount TO order.total
END

RULE "Bonus Example"
WHEN order.total > 500
THEN apply 100 bonus TO customer.points
END

RULE "Fee Example"
WHEN order.total < 25
THEN apply 5% fee TO order.total
END
```

## Operator Precedence

Understanding operator precedence is crucial for complex rules:

1. **AND** has higher precedence than **OR**
2. Conditions are evaluated left to right within the same precedence level

### Example:

```minirule
A AND B OR C AND D
```

This is evaluated as:
```
(A AND B) OR (C AND D)
```

### Practical Example:

```minirule
RULE "Flash Sale"
WHEN customer.email_subscriber IS "yes"
  AND order.category IS "electronics"
  OR customer.app_user IS "yes"
  AND order.total > 200
THEN apply 18% discount TO order.total
END
```

This rule applies the discount if:
- (Customer is an email subscriber AND order is electronics) **OR**
- (Customer is an app user AND order total > 200)

## Usage

### In Code

```typescript
import { interpreter } from "minirule";
import { readFileSync } from "fs";

const rule = readFileSync("examples/comprehensive-example.minirule", "utf-8");
const result = interpreter.interpret(rule);
console.log(JSON.stringify(result, null, 2));
```

### In the Playground

Visit [Minirule Playground](https://minirule.vercel.app/) and paste any example to see it in action.

## Real-World Scenarios

The comprehensive example demonstrates realistic e-commerce scenarios:

1. **VIP Customer Programs** - Tier-based benefits
2. **Seasonal Promotions** - Time-based discounts
3. **New Customer Acquisition** - Welcome offers
4. **Bulk Purchase Incentives** - Volume discounts
5. **Processing Fees** - Conditional charges
6. **Loyalty Programs** - Points and rewards
7. **Flash Sales** - Multi-condition promotions
8. **Regional Offers** - Location-based rules
9. **Personalized Marketing** - Birthday offers
10. **Complex Tiering** - Multi-factor conditions

## Tips for Writing Rules

1. **Use DEFINE** for values you might want to change or reuse
2. **Group related conditions** with AND before using OR
3. **Be explicit** with your logic - the precedence might not match your intention
4. **Test complex rules** in the playground before deploying
5. **Comment your rules** to explain business logic

## Coming Soon

Future features will include:
- NOT operator
- Parentheses for explicit grouping
- IN operator with arrays
- Time-based conditions (RECENTLY)
- Multiple actions in THEN clause
- More complex nested conditions

Check the [main README](../README.md) for the full roadmap.
