Primary actions: "Go inside", "How to say it", "Tell us". 56px tall, 16px radius, presses to 97%.
```jsx
<Button iconAfter="arrow-right" onClick={goIn}>Go inside</Button>
<Button variant="outline" ink="var(--house-neel-on)">How to say it</Button>
{/* on a house sheet */}
<Button ink="var(--house-rose-on)" paper="var(--house-rose)">Go inside</Button>
```
- Disabled never fades the label (AAA); it switches to a dashed border and aria-disabled.
