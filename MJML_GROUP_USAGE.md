# mj-group Usage Guide

## What is mj-group?

The `mj-group` component prevents columns from stacking on mobile devices. Normally, MJML columns stack vertically on small screens, but columns inside a `mj-group` stay side-by-side.

## Proper Structure

```xml
<mj-section>
  <mj-group>
    <mj-column width="50%">
      <!-- Content -->
    </mj-column>
    <mj-column width="50%">
      <!-- Content -->
    </mj-column>
  </mj-group>
</mj-section>
```

## Important Rules

1. **mj-group is a child of mj-section** (same level as columns)
2. **mj-group contains mj-column elements** (columns go INSIDE the group)
3. **Columns inside mj-group must use percentage widths** (not pixels)
4. **mj-group and regular columns can coexist** in the same section

## How to Use in the Editor

### Option 1: Use the Group Block (Recommended)
1. Drag the **"Group"** block from the left sidebar into a section
2. It comes pre-populated with 2 columns at 50% width each
3. Customize the columns as needed
4. Delete existing standalone columns if replacing them

### Option 2: Manual Approach
1. Delete existing columns in a section
2. Add a mj-group block
3. Customize the columns inside

### Option 3: Mix Group and Regular Columns
You can have BOTH grouped and ungrouped columns in the same section:

```xml
<mj-section>
  <!-- Regular column (will stack on mobile) -->
  <mj-column width="100%">
    <mj-text>Full width header</mj-text>
  </mj-column>

  <!-- Grouped columns (stay side-by-side on mobile) -->
  <mj-group>
    <mj-column width="50%">
      <mj-text>Left</mj-text>
    </mj-column>
    <mj-column width="50%">
      <mj-text>Right</mj-text>
    </mj-column>
  </mj-group>
</mj-section>
```

## Visual Indicators

In the editor, mj-group elements have special styling:

- **Left Sidebar Block**: Green-tinted border with "GROUP" badge
- **On Canvas**: Green "GROUP" label and dashed outline when selected

## Common Mistakes

❌ **Don't add mj-group as a third column**
```xml
<!-- WRONG -->
<mj-section>
  <mj-column>Content</mj-column>
  <mj-column>Content</mj-column>
  <mj-group></mj-group>  <!-- This is wrong! -->
</mj-section>
```

✅ **Use mj-group to wrap columns**
```xml
<!-- CORRECT -->
<mj-section>
  <mj-group>
    <mj-column width="50%">Content</mj-column>
    <mj-column width="50%">Content</mj-column>
  </mj-group>
</mj-section>
```

## When to Use mj-group

Use `mj-group` when you want columns to remain side-by-side on mobile devices, such as:

- Image galleries that should stay in a grid
- Pricing tables with multiple columns
- Icon rows that need to stay horizontal
- Any layout where stacking would break the design

## Mobile Behavior

- **Without mj-group**: Columns stack vertically on mobile (default MJML behavior)
- **With mj-group**: Columns shrink proportionally but stay side-by-side

## Additional Resources

- [MJML mj-group Documentation](https://documentation.mjml.io/#mj-group)
- [Medium Article: Mobile Column Control](https://medium.com/mjml-making-responsive-email-easy/more-control-over-how-your-columns-display-on-mobile-in-mjml-2-2-0-192f90d33a77)
