# KijijiCheck 
 [<img src="icons/KijijiCheck.png">](https://addons.mozilla.org/en-US/firefox/addon/kijijicheck/)

 A tool that collects and compares items on kijiji.
 
 Download the Add-On [here](https://addons.mozilla.org/en-US/firefox/addon/kijijicheck/). 

## What does this do?

While trying to shop for cars I found that I would
often see the same model of car at different price
ranges. There is clearly a 'average' or 'expected'
price for a certain model, and year in an area, but
it is hard to calculate this in your head. This 
add-on stores the cars you look at on kijiji and
calculates the averages for certain models and gives
you a rough statistical breakdown of previous ads.

At the moment this add-on does not have full functionality 
and is intended as a POC. Over time I am hoping to add 
graphs and better analysis.

## How do I use it?

Really simple!

1. [Install the add-on](https://addons.mozilla.org/en-US/firefox/addon/kijijicheck/). 
2. Visit some car ads on kijiji.
3. While looking at an advertisement, click on the addon.

This will display a summary of the current car vs. previous
cars/advertisements.

## How does it work?

I have it currently pulling data from pages and
storing it in the browser. A later addition will
be to pull this data from the browser so it can
be stored/analysed externally. Since there is no
relational database I could use it is stored in 
the expected analysis order using key-value pairs.

## Code Breakdown 

`background` - Background scripts

`content` - Injected content scripts

`icons` - Icons for the add-on

`popup` - Code for the dropdown in the menu
