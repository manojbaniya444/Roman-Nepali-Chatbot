const http = require("http");
const fs = require("fs").promises;
const path = require("path");

const server = http.createServer(async (req, res) => {
  // Serve the HTML file for the root route
  if (req.url === "/") {
    try {
      const htmlContent = await fs.readFile(
        path.join(__dirname, "index.html"),
        "utf-8"
      );
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(htmlContent);
      return;
    } catch (error) {
      res.writeHead(500);
      res.end("Error loading HTML file");
      return;
    }
  }

  // Handle SSE endpoint
  if (req.url === "/stream") {
    // Set headers for SSE
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      // 'Access-Control-Allow-Origin': '*'
    });

    // Function to simulate LLM token generation
    const tokens = `
        **The Rise and Impact of Artificial Intelligence: A Transformative Force in the Modern World**

Artificial Intelligence (AI) is no longer a concept of futuristic imagination but a rapidly growing field that has already begun reshaping industries and everyday life. With advancements in machine learning, deep learning, and neural networks, AI is evolving in ways that were once unimaginable. This essay explores the development, applications, and potential consequences of AI, highlighting its profound impact on society, economy, and ethics.

### The Evolution of Artificial Intelligence

The origins of AI trace back to the 1950s, with pioneers like Alan Turing and John McCarthy laying the groundwork for machine learning and computational theory. Turing’s concept of the "universal machine" and the creation of the Turing Test offered an early vision of machines mimicking human intelligence. Over the decades, AI research faced both triumphs and setbacks, from the optimism of the 1960s to the "AI winters" of the 1970s and 1980s, when funding and enthusiasm waned.

However, the turn of the 21st century witnessed a significant breakthrough. The advent of powerful computing hardware, vast amounts of data, and sophisticated algorithms led to the rapid expansion of AI capabilities. Today, AI systems are capable of performing tasks that once required human intellect, such as language translation, image recognition, and even driving vehicles. These advancements are largely due to machine learning, where systems learn from large datasets and improve over time without human intervention.

### Applications of AI in Modern Life

AI's impact is widespread, with applications across virtually every sector. In healthcare, AI is revolutionizing diagnostics and treatment planning. Machine learning algorithms analyze medical images to detect early signs of diseases like cancer and offer insights into treatment options tailored to individual patients. AI-powered tools also assist in drug discovery, speeding up the development of life-saving medications.

In the business world, AI is optimizing supply chains, automating customer service, and personalizing marketing strategies. Algorithms can predict consumer behavior, manage inventory, and even negotiate prices. Financial institutions use AI for fraud detection, risk analysis, and algorithmic trading. The growing reliance on AI in these fields has led to increased efficiency and profitability but also raises questions about job displacement and the future of work.

The entertainment industry has also embraced AI, with algorithms recommending movies and music based on individual preferences. AI is instrumental in creating realistic visual effects, and in gaming, it powers non-playable characters (NPCs) that adapt to players' actions. Even in the arts, AI is being used to generate paintings, music, and literature, challenging traditional notions of creativity.

### Economic and Social Implications

AI's rapid development is reshaping the global economy, creating new opportunities while simultaneously posing challenges. On one hand, AI is spurring innovation and enabling businesses to scale efficiently. On the other hand, it has sparked fears about job automation. As machines take over repetitive tasks, many industries are witnessing a shift in the workforce. Manufacturing, retail, and even sectors like law and journalism are seeing the rise of AI-driven automation.

While some experts argue that AI will create new jobs and economic opportunities, others warn that it may exacerbate income inequality. High-skill jobs in AI development and data science are in demand, but low-skill workers may struggle to find employment as machines replace manual tasks. Governments and businesses must address these issues by investing in retraining programs and exploring universal basic income to mitigate the potential negative effects of AI on employment.

### Ethical Concerns and Challenges

With great power comes great responsibility. The ethical implications of AI are a topic of intense debate among scholars, policymakers, and technologists. One of the primary concerns is bias. Since AI systems are trained on data, they can inherit the biases present in those datasets. This can lead to discriminatory outcomes in areas like hiring, lending, and law enforcement. For instance, AI-powered hiring tools might favor male candidates over female ones if the training data reflects historical gender biases.

Another pressing issue is privacy. AI systems often require access to vast amounts of personal data to function effectively, raising concerns about data security and individual privacy. The growing use of AI in surveillance, facial recognition, and social media platforms further complicates these concerns, with the potential for mass data collection and misuse.

Moreover, there are concerns about the long-term implications of autonomous AI systems. As AI continues to advance, there is the possibility of machines making decisions beyond human control. In areas like autonomous weapons or self-driving cars, the potential for harm exists if AI systems malfunction or are exploited for malicious purposes. The development of AI must therefore be accompanied by robust ethical frameworks and regulations to ensure its responsible deployment.

### The Future of AI

The future of AI is both exciting and uncertain. As AI continues to evolve, its potential applications seem limitless. We may see breakthroughs in areas like artificial general intelligence (AGI), where machines possess human-like reasoning and problem-solving abilities. AI could transform education, creating personalized learning experiences for students, or revolutionize space exploration by analyzing vast amounts of data from distant planets.

However, the rapid pace of AI development also requires careful consideration. Society must ensure that AI is used for the greater good, balancing innovation with ethical responsibility. Governments, businesses, and technologists must collaborate to establish clear guidelines that prioritize transparency, fairness, and accountability in AI systems.

### Conclusion

Artificial Intelligence is no longer a distant dream; it is an integral part of our daily lives, driving innovation, efficiency, and productivity. From healthcare to finance, AI is transforming industries and creating new opportunities. However, it also raises important ethical, economic, and social challenges. As AI continues to advance, it is crucial that we approach its development with caution and foresight, ensuring that its benefits are maximized while its risks are mitigated. By doing so, we can harness the full potential of AI to build a better, more equitable future.
        `.split(" ");
    let currentToken = 0;

    // Send tokens periodically
    const sendToken = () => {
      if (currentToken < tokens.length) {
        const data = JSON.stringify({ token: tokens[currentToken] + " " });
        res.write(`data: ${data}\n\n`);
        currentToken++;
        setTimeout(sendToken, 300); // Simulate thinking time
      } else {
        // Send completion event
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      }
    };

    // Start sending tokens
    sendToken();

    // Handle client disconnect
    req.on("close", () => {
      // Clean up any resources if needed
      console.log("Client disconnected");
    });

    return;
  }

  // Handle 404 for other routes
  res.writeHead(404);
  res.end("Not found");
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
