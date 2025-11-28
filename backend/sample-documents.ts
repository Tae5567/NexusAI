// Sample knowledge base documents for testing
// These will be ingested into the vector database

export const sampleDocuments = [
  {
    title: 'Return Policy',
    source: 'policies/returns',
    content: `
# Return Policy

We want you to be completely satisfied with your purchase. If you're not happy with your order, you can return it within 30 days of delivery.

## How to Return an Item

1. Log into your account at www.example.com
2. Go to "Order History"
3. Select the order containing the item you want to return
4. Click "Request Return" and select the reason
5. Print the prepaid shipping label
6. Pack the item securely with all original packaging and tags
7. Attach the label to the package
8. Drop off at any authorized shipping location

## Refund Timeline

- Returns are processed within 5-7 business days after we receive your package
- Refunds are issued to your original payment method
- You'll receive an email confirmation when your refund is processed
- Please allow 3-5 business days for the refund to appear in your account

## Items That Cannot Be Returned

- Digital downloads and gift cards
- Personalized or custom-made items
- Items marked as "Final Sale"
- Opened cosmetics or personal care items
- Perishable goods

## Return Shipping

Return shipping is FREE for defective items or our errors. For other returns, a $7.99 shipping fee will be deducted from your refund.

## Exchange Policy

We currently don't offer direct exchanges. Please return the item for a refund and place a new order for the item you want.

## Questions?

Contact our customer support team at support@example.com or call 1-800-SUPPORT (1-800-787-7678).
    `
  },
  {
    title: 'Shipping Information',
    source: 'policies/shipping',
    content: `
# Shipping Information

We offer multiple shipping options to meet your needs.

## Shipping Options

### Standard Shipping (5-7 business days)
- Cost: $5.99
- FREE on orders over $50
- Most popular option

### Expedited Shipping (2-3 business days)
- Cost: $12.99
- Available for orders placed before 2:00 PM EST
- Ideal for time-sensitive purchases

### Overnight Shipping (Next business day)
- Cost: $24.99
- Available for orders placed before 12:00 PM EST Monday-Thursday
- Weekend orders ship Monday

### International Shipping

**Canada**: 7-10 business days, starting at $15.00
**Mexico**: 8-12 business days, starting at $18.00
**Europe**: 10-15 business days, starting at $25.00
**Asia**: 12-18 business days, starting at $30.00
**Australia**: 14-20 business days, starting at $35.00

## Order Tracking

- You'll receive a tracking number via email within 24 hours of shipment
- Track your package at www.example.com/tracking
- Or log into your account and view "Order History"
- Tracking updates every 12-24 hours

## Shipping Restrictions

- We currently do not ship to PO boxes or APO/FPO addresses
- Some oversized items may have additional shipping fees
- Hazardous materials cannot be shipped via air
- Certain items may have country-specific restrictions

## Processing Time

- Most orders ship within 1-2 business days
- Custom or personalized items may take 3-5 business days
- During peak seasons (holidays), processing may take longer

## Shipping Delays

If your package is delayed:
1. Check the tracking information for updates
2. Contact the carrier directly
3. If delayed more than 3 days past the expected delivery, contact us

We'll work with you to resolve any shipping issues!
    `
  },
  {
    title: 'Account Management Guide',
    source: 'help/account',
    content: `
# Account Management Guide

Your account gives you access to order history, saved addresses, payment methods, and exclusive benefits.

## Creating an Account

1. Click "Sign Up" in the top right corner of any page
2. Enter your email address and create a secure password
3. Verify your email by clicking the link we send you
4. Complete your profile with your name and shipping address
5. Start shopping!

## Password Security

Create a strong password with:
- At least 8 characters
- A mix of uppercase and lowercase letters
- Numbers and special characters
- Avoid using common words or personal information

## Resetting Your Password

If you forget your password:
1. Click "Forgot Password?" on the login page
2. Enter your email address
3. Check your email for a reset link (check spam folder too)
4. Click the link and create a new password
5. Log in with your new password

The reset link expires after 24 hours for security.

## Updating Account Information

### Personal Information
- Go to Account Settings → Profile
- Update your name, email, or phone number
- Click "Save Changes"
- You may need to verify a new email address

### Shipping Addresses
- Add multiple shipping addresses
- Set a default address for faster checkout
- Update or delete old addresses
- Perfect for sending gifts to different locations

### Payment Methods
- Securely save credit/debit cards
- Add multiple payment methods
- Set a default card for quick checkout
- All payment info is encrypted with industry-standard security

## Order History

View all your past orders:
- Order date and status
- Items purchased
- Tracking information
- Download invoices
- Request returns or support

## Communication Preferences

Manage what emails you receive:
- Order confirmations (cannot be disabled)
- Shipping notifications
- Promotional offers and sales
- Product recommendations
- Newsletter

Update preferences in Account Settings → Communication Preferences

## Account Security

Protect your account:
- Use a unique password
- Never share your login credentials
- Log out on shared devices
- Review account activity regularly
- Contact us immediately if you notice suspicious activity

## Deleting Your Account

To permanently delete your account:
1. Email support@example.com with "Delete My Account" in the subject
2. Include your registered email address
3. We'll process your request within 5 business days
4. All personal data will be permanently deleted

Note: This action cannot be undone. Order history will be removed.

## Need Help?

Contact our support team:
- Email: support@example.com
- Phone: 1-800-SUPPORT
- Live chat: Available 9 AM - 9 PM EST Monday-Friday
    `
  },
  {
    title: 'Product Warranty Information',
    source: 'policies/warranty',
    content: `
# Product Warranty Information

We stand behind the quality of our products. All items come with manufacturer warranties.

## Warranty Coverage by Product Type

### Electronics (1-Year Limited Warranty)
- Covers manufacturing defects and workmanship issues
- Does NOT cover: accidental damage, water damage, unauthorized repairs
- Must be used according to instructions
- Proof of purchase required

### Furniture (5-Year Structural Warranty)
- Covers frame defects and structural issues
- Does NOT cover: fabric wear, stains, color fading, normal wear and tear
- Requires proper assembly according to instructions
- Keep assembly instructions for warranty claims

### Appliances (2-Year Limited Warranty)
- Covers parts and labor for defects
- Does NOT cover: normal wear, consumable parts (filters, bulbs)
- Must be registered within 30 days of purchase for full coverage
- In-home service available in most areas

### Clothing & Accessories (90-Day Quality Guarantee)
- Covers defects in materials and workmanship
- Does NOT cover: normal wear, washing damage, alterations
- Items must have original tags for claims

## How to Make a Warranty Claim

1. Contact our warranty department at warranty@example.com
2. Provide:
   - Order number or proof of purchase
   - Product model/SKU number
   - Photos of the issue (if possible)
   - Description of the problem
3. We'll review and respond within 2 business days
4. If approved, we'll provide:
   - Repair instructions
   - Replacement product
   - Refund (if repair/replacement not possible)

## Extended Warranty Options

Purchase additional coverage at checkout:

**2-Year Extended Protection**: $19.99
- Extends coverage by 2 years
- Includes accidental damage
- No deductibles

**3-Year Extended Protection**: $29.99
- Extends coverage by 3 years
- Includes accidental damage and normal wear
- Free replacements

**5-Year Premium Protection**: $49.99
- Extends coverage by 5 years
- Includes everything: accidents, drops, spills, wear and tear
- Priority service and free shipping

Extended warranties must be purchased within 30 days of product purchase.

## Warranty Exclusions

Warranties do NOT cover:
- Damage from misuse or abuse
- Normal wear and tear
- Cosmetic damage that doesn't affect functionality
- Damage from unauthorized repairs or modifications
- Products used commercially (unless specified)
- Lost or stolen items

## International Warranties

- Warranties are valid in the country of purchase only
- International shipping costs are customer's responsibility
- Some manufacturers offer international warranty programs - contact them directly

## Discontinued Products

If your product is discontinued and cannot be repaired:
- We'll offer a comparable replacement
- Or provide store credit for current value
- You choose the solution that works best for you

## Questions?

Warranty Department:
- Email: warranty@example.com
- Phone: 1-800-WARRANTY
- Hours: Monday-Friday, 9 AM - 6 PM EST
    `
  },
  {
    title: 'Frequently Asked Questions',
    source: 'help/faq',
    content: `
# Frequently Asked Questions

Quick answers to common questions about shopping with us.

## Ordering

**Q: How do I place an order?**
A: Browse our products, add items to your cart, and proceed to checkout. You'll need to provide shipping and payment information.

**Q: Can I modify my order after placing it?**
A: Orders can be modified within 1 hour of placement. After that, the order may already be in our warehouse for processing. Contact us immediately at support@example.com.

**Q: Do you offer gift wrapping?**
A: Yes! Gift wrapping is available for $4.99 per item during checkout. We include a gift message card too.

**Q: Can I use multiple discount codes?**
A: Only one discount code can be applied per order. The system will automatically apply the best available discount.

## Payment

**Q: What payment methods do you accept?**
A: We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay.

**Q: Is my payment information secure?**
A: Absolutely. We use industry-standard SSL encryption and never store complete credit card numbers on our servers.

**Q: When will I be charged?**
A: Your payment method is charged immediately when you place your order.

**Q: Do you accept international credit cards?**
A: Yes, we accept credit cards from most countries. Your bank may charge a foreign transaction fee.

## Shipping

**Q: How long will my order take to arrive?**
A: Standard shipping takes 5-7 business days. Expedited (2-3 days) and overnight options are available.

**Q: Do you ship internationally?**
A: Yes! We ship to over 100 countries. International delivery times vary by location.

**Q: How can I track my order?**
A: You'll receive a tracking number via email within 24 hours of shipment. Track at www.example.com/tracking.

**Q: What if my package is lost or stolen?**
A: Contact us immediately. We'll work with the carrier to locate your package or send a replacement.

## Returns & Refunds

**Q: What is your return policy?**
A: 30-day returns on most items. Items must be unused and in original packaging with tags attached.

**Q: How long do refunds take?**
A: Refunds are processed within 5-7 business days after we receive your return. Allow 3-5 additional days for your bank to process it.

**Q: Can I return sale items?**
A: Yes, unless marked as "Final Sale." Final Sale items cannot be returned.

**Q: Who pays for return shipping?**
A: Returns for defective items or our errors are free. Other returns have a $7.99 shipping fee deducted from your refund.

## Account

**Q: Do I need an account to order?**
A: No, you can checkout as a guest. However, an account lets you track orders, save addresses, and get faster checkout.

**Q: I forgot my password. What do I do?**
A: Click "Forgot Password?" on the login page. We'll email you a reset link.

**Q: How do I change my email address?**
A: Log in, go to Account Settings → Profile, update your email, and verify the new address.

## Products

**Q: Are your products authentic?**
A: Yes! We source all products directly from manufacturers or authorized distributors.

**Q: Do you restock sold-out items?**
A: Most items are restocked regularly. Click "Notify Me" on the product page to get an email when it's back.

**Q: Can I see products in person before buying?**
A: We're an online-only retailer, but we offer detailed photos, videos, and customer reviews to help you decide.

## Customer Service

**Q: How can I contact customer service?**
A: Email support@example.com, call 1-800-SUPPORT, or use live chat (9 AM - 9 PM EST Monday-Friday).

**Q: Do you have a price match policy?**
A: Yes! We'll match prices from authorized retailers within 7 days of purchase. Contact support@example.com with proof.

**Q: Can I cancel my order?**
A: Orders can be cancelled within 1 hour of placement. After that, you'll need to return it once received.

## Still Have Questions?

Contact us at:
- Email: support@example.com
- Phone: 1-800-SUPPORT (1-800-787-7678)
- Live Chat: Available 9 AM - 9 PM EST Monday-Friday
- Social Media: @ExampleStore on Twitter, Facebook, Instagram

We typically respond within 2-4 hours during business hours!
    `
  }
];

export default sampleDocuments;