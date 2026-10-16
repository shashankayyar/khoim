Build-time share images. Render each format headless and save as PNG (og.png, square.png, story.png) per place; set og:image to the og file.
```jsx
<ShareCard place="canacona" format="og" />
<ShareCard place="v626704" format="story" />
```
- Devanagari and Romi share one size. If one is missing it is left out, not replaced.
- At WhatsApp thumbnail size (about 300px wide) the Devanagari is still about 28px.
