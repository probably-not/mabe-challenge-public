Hi there!

Ready for Moon Active’s Backend Performance Challenge?! 🚀💪🏻

Below you will find all the details and terms related to the challenge. Please submit your solution by Sunday, May 22nd.

Important: If you’re the lucky winner, then you must be present at the Backend Meetup (at our office) on May 25th to receive the prize (MacBook Pro 16 in).


# Background Info:

Included in this repository is an index.js file.
Inside the file there’s a simple web server that implements a "Card Service".
For every request, the service provides each user a card out of the cards listed in "cards.json", and that card can be served only once per user.

**The problem**:
The current implementation is slow and inefficient, and it takes the tester program more than 10 minutes to complete a full run of a load testing cycle.

**The challenge**:
Make the service handle higher throughput and finish quicker.
The winner will be the solution with the lowest overall runtime!

**How**:
As long as you maintain the API interface and index.js as an entry point, then everything goes! :)

# Constraints and terms
+ The solution must be written in NodeJS only.
+ The solution must adhere to the "business" requirements listed above.
+ The included tester must pass successfully as scoring will be based on it.
+ For the scoring, we will run prebuilt testers and record the outcome.
+ The winner will be the one that has the solution with the lowest overall runtime to complete the challenge successfully.
+ The winner will be announced at our Backend Meetup at our office in Tel Aviv on May 25th.
+ The winner must attend the meetup to get the reward.

# How to submit
- Upload  your `index.js`, `package.json` and `package-lock.json` files to a new repository in Github - make sure it is publicly accessible.
- Submit your Github Repository in the [Google form](https://docs.google.com/forms/d/17Iatjk7XA92BntC6EPYFwbMPyKFQ2mJegA9TMvCnH-g)
- Attend the meetup.

## Challenge Setup

- Install and run a local redis server on port 6379.
- Clone this repository to your computer.
- Install nodejs runtime and run `npm install`.
- Run the web server `node index.js`.
- Make a test call to `http://localhost:3000/card_add?id=0`.
- You should receive a payload like this:
```json
{
  "id": "410bc4fc-23a9-4cd0-81fb-c96453516b47",
  "name": "16b5b50b-64c9-4edd-8cb3-464be756eaac"
}
```
- Run the tester binaries included according to your platform `./osx-intel` or `./linux`
- You should see the following payload on console:
```text
generating cards
starting node processes
waiting for node process to boot
.Example app listening at http://0.0.0.0:4001
Example app listening at http://0.0.0.0:4002
.
generating in memory store
11724 requests/second
12341 requests/second
....
```
Start hacking away and good luck! :)


*To build the tester binary from source, install go and run: *
```bash
cd tester_src 
go build -o tester main.go 
mv tester .. 
cd ..
./tester
```

For any technical problems, feel free to reach out to me:
Tali.we@moonactive.com

# Tester setup
- Tests will run on a c5.2xlarge machine
- Configuration of the testers will be the same as presented here, 100 cards, 10K users
- Each node applications will be limited to ~1 core, 512MB RAM
- NodeJS version will be latest v16


# Q&A
- Q: I see in the README of the challenge that it says "For the scoring, we will run prebuilt testers and record the outcome". Is this prebuilt tester made of the same code as the tester in the challenge repository, or is there a different tester that will run? I ask because I see that the current tester raises 2 instances of the node service, one on port 4001 and one on port 4002, and raising multiple instances of the service might affect how I attack this challenge.
- A: Yes the testers that we'll run will be the same that are provided here more additional logic like storing results and 1 minute time limit.

- Q: I see one of the constraints is that the solution must be written in NodeJS only. Does this mean all code must be in pure Javascript? Is this disallowing writing for example writing a server in Go or Rust, and triggering its startup from the NodeJS index.js file? What about writing Lua scripts that run in Redis (https://redis.io/docs/manual/programmability/eval-intro/)?
- A: Writing the solution must be in NodeJS as a runtime and Javascript as code, no compiling, precompiling, inlining code in any other language is allowed, or using any other runtimes like JustJS or others. LUA for making redis calls is acceptable.

- Q: Is the cards.json file remains static
- A: we will generate a new card.json before each run


