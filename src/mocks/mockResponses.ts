export const LONG_RESPONSE = `
    Here is a detailed explanation of how to approach accessibility and testing in a modern web application.

    First, it is important to ensure that all interactive elements are accessible via keyboard navigation. This includes verifying that focus states are visible and that users can move through the interface in a logical order without becoming trapped.

    Second, screen reader support should be validated by ensuring that all elements have appropriate roles, labels, and descriptions. Live regions should be used carefully to announce dynamic content updates without overwhelming the user.

    Third, automated testing tools such as Playwright and accessibility engines like axe-core can be used to catch common issues. However, manual testing is still essential for identifying usability problems that automated tools cannot detect.

    Key steps to follow:
        1. Verify keyboard navigation across all interactive elements
        2. Confirm accessible names and roles for buttons, inputs, and dialogs
        3. Test dynamic content announcements using aria-live regions
        4. Validate color contrast and visual focus indicators
        5. Combine automated and manual accessibility testing

    Finally, always test your application under real-world conditions, including slower networks, reduced motion settings, and assistive technologies. Accessibility is not just about compliance. It is about creating a usable experience for everyone.
`;