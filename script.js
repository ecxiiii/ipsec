// IPsec Architecture Presentation - Interactive Navigation
(function() {
    'use strict';

    // Simplified presentation notes using analogies
    const slideNotes = {
        1: {
            title: "Title Slide",
            notes: `Think of IPsec as a secure postal service for the internet. Just like registered mail with tamper-proof envelopes, IPsec makes sure your data gets delivered safely and privately.`
        },
        2: {
            title: "Executive Summary",
            notes: `**What is IPsec?**

Think of IPsec like a security guard for internet traffic. Just as a security guard:
- Checks IDs (authentication)
- Seals packages (encryption)
- Prevents people from stealing packages and returning them later (anti-replay)

It works at the network layer - like having security at the building level, not just individual rooms.`
        },
        3: {
            title: "IPsec Overview",
            notes: `**The Four Pillars of Security:**

🔒 **Confidentiality**: Like writing in invisible ink - only the intended recipient can read it.

✓ **Data Integrity**: Like a tamper-proof seal on medicine bottles - you know if someone opened it.

🔑 **Authentication**: Like showing your driver's license - proving you are who you say you are.

🛡️ **Anti-replay**: Like ticket stubs at a concert - can't reuse the same ticket twice.`
        },
        4: {
            title: "Architecture Components",
            notes: `Think of IPsec like a secure delivery service with five key parts:

1. **Security Protocols (AH & ESP)**: The different types of security envelopes you can use
2. **Security Associations (SA)**: The delivery agreement between sender and receiver
3. **Key Management (IKE)**: The system that creates and exchanges secret codes
4. **Crypto Algorithms**: The actual locks and seals used
5. **Policy Database**: The rulebook that says what needs protection`
        },
        5: {
            title: "Protocol Components",
            notes: `**Think of these as departments in a security company:**

**AH (Authentication Header)**: The signature verification department - makes sure the package is authentic and untampered.

**ESP (Encapsulating Security Payload)**: The vault department - locks everything in a secure box AND verifies authenticity.

**IKE**: The key exchange department - safely creates and shares lock combinations.

**SPD**: The policy manual - "What should we protect and how?"

**SAD**: The active contracts file - lists all current security agreements.

**SA**: A single security contract between two parties.`
        },
        6: {
            title: "Authentication Header (AH)",
            notes: `**Think of AH like a tamper-evident seal on a glass jar:**

You can see the contents (no encryption), but you'll know if anyone opened or modified it.

**The Problem**: Like writing your return address on the outside of the envelope - if someone at the post office changes it (NAT), the seal breaks.

**Why it matters**: AH authenticates even the "envelope" (IP header), making it incompatible with address changes.`
        },
        7: {
            title: "ESP - Encapsulating Security Payload",
            notes: `**Think of ESP like a locked safe deposit box:**

The box (encryption) hides what's inside, AND you can verify it wasn't tampered with (authentication).

**Three modes, like different security levels:**
1. Lock only (encryption) - hides contents
2. Seal only (authentication) - detects tampering
3. Lock + Seal (both) - the recommended combo!

**Why ESP wins**: It doesn't seal the "envelope address," so the post office (NAT) can change addresses without breaking security.`
        },
        8: {
            title: "Internet Key Exchange (IKE)",
            notes: `**Think of IKE like a secret handshake to start a secure conversation:**

Imagine you and a friend want to create a secret code over a phone that might be tapped:

**Phase 1**: You establish a secure way to talk (like speaking pig latin)
- Prove you're really you (authentication)
- Create the first layer of secret code (key exchange)

**Phase 2**: Using your pig latin, you create the actual secret code for messages
- Agree on the encryption method
- Create the keys for actual data

**Why two phases?** Phase 1 is expensive (like learning pig latin), but you only do it once. Phase 2 is quick and can be repeated many times.`
        },
        9: {
            title: "Transport Mode",
            notes: `**Think of Transport Mode like wrapping just the gift, not the shipping box:**

The delivery address (IP header) is visible to everyone, but the gift inside (payload) is securely wrapped.

**When to use:**
- Direct communication between two computers that both understand IPsec
- Like sending a wrapped gift directly to your friend's house

**Benefits:**
- Less packaging (lower overhead)
- More efficient for direct connections`
        },
        10: {
            title: "Tunnel Mode",
            notes: `**Think of Tunnel Mode like a security truck for valuables:**

You put the entire package (original box AND gift) inside a secure armored truck.

**The process:**
1. Original package with sender/receiver addresses
2. Put it ALL in an armored truck
3. Truck has its own pickup/delivery addresses (tunnel endpoints)

**When to use:**
- Connecting entire networks (like connecting two office buildings)
- When you want to hide even WHERE the package came from

**Trade-off**: More overhead (two sets of addresses), but better security and flexibility.`
        },
        11: {
            title: "Mode Comparison",
            notes: `**Simple analogy:**

**Transport Mode** = Registered mail with tracking
- Original envelope visible
- Contents protected
- Direct delivery

**Tunnel Mode** = Armored car service
- Everything in a secure vehicle
- Can't see original package
- More secure, but costs more

**Choose Transport when:** Both sender and receiver can handle security directly

**Choose Tunnel when:** Need to protect entire networks or hide internal addresses`
        },
        12: {
            title: "Security Association (SA)",
            notes: `**Think of an SA like a security contract for a one-way delivery route:**

Just like a delivery contract specifies:
- What vehicle to use (AH or ESP)
- What locks to use (encryption algorithm)
- What seals to use (authentication)
- How long the contract lasts (lifetime)

**Important**: It's ONE-WAY only!

If Alice sends to Bob AND Bob sends to Alice, you need TWO contracts (two SAs) - one for each direction.

**Why?** Different security needs in each direction, like how outgoing and incoming mail might need different security levels.`
        },
        13: {
            title: "IPsec Databases",
            notes: `**Think of these as three filing cabinets:**

**SPD (Security Policy Database)** = The company policy manual
- "Should we protect this traffic?"
- PROTECT it, let it BYPASS, or DISCARD it
- Like: "All financial data MUST be encrypted"

**SAD (Security Association Database)** = The active contracts file
- Contains all current security agreements
- "Here's how to encrypt traffic to Bob"
- Updated as contracts are made and expire

**PAD (Peer Authorization Database)** = The authorized partners list
- "Is this person allowed to create a security contract with us?"
- Prevents strangers from setting up fake secure channels`
        },
        14: {
            title: "IKE Phase 1",
            notes: `**Think of Phase 1 like a secret agent establishing contact:**

**Authentication Methods:**
- **PSK (Pre-shared Key)**: Like a secret password you both memorized beforehand
- **Certificates**: Like showing official government ID
- **Public Key**: Like a lockbox exchange - you have each other's public locks

**Main Mode vs Aggressive Mode:**

**Main Mode** = Six careful handshakes (more secure)
- Like meeting in a private room, whispering the password
- Your identity is protected from eavesdroppers

**Aggressive Mode** = Three quick handshakes (faster but exposed)
- Like shouting across a crowded room
- Faster, but everyone hears your name

**The expensive part**: Diffie-Hellman key exchange - like creating a new secret language together. It's hard work, so you reuse this secure channel for many conversations.`
        },
        15: {
            title: "IKE Phase 2",
            notes: `**Think of Phase 2 like ordering food through a secure phone line:**

You already have a secure phone connection (Phase 1), now you use it to:

1. Agree on what encryption to use for your data
2. Decide between AH or ESP (signature only vs. locked box)
3. Create the actual secret keys for your data
4. Set up TWO agreements (one for each direction)

**Proxy IDs** = Like specifying which departments can talk to which
- "Sales can talk to Customer Service"
- Both sides must agree on who can communicate

**PFS (Perfect Forward Secrecy)** = Extra security insurance
- Like changing your password AND the recovery questions
- Even if someone steals one key, they can't use it to decrypt old or future messages`
        },
        16: {
            title: "IKEv1 vs IKEv2",
            notes: `**Think of IKEv1 and IKEv2 like iPhone generations:**

**IKEv1** = Original iPhone (still works, but clunky)
- Lots of steps for everything
- Two modes to choose from (Main/Aggressive)
- Gets the job done but inefficient

**IKEv2** = iPhone 15 (modern, streamlined)
- Fewer steps, better battery (efficiency)
- Built-in features that required apps before (NAT traversal)
- Better at handling dropped connections
- More secure by default

**Should you upgrade?** If you're building something new, absolutely use IKEv2. But many old systems still use IKEv1 successfully.`
        },
        17: {
            title: "Cryptographic Algorithms",
            notes: `**Think of encryption algorithms like different types of locks:**

**AES** = High-security deadbolt with special key
- Hardware-accelerated = built-in automatic lock (super fast)
- Best when your computer has special encryption chips
- Like having a smart lock that locks itself

**ChaCha20** = Combination lock (great in software)
- Works great without special hardware
- Like a really good combination lock anyone can use
- Perfect for phones and tablets without encryption chips

**Legacy algorithms (3DES, DES)** = Old padlocks that can be picked
- ❌ Don't use these anymore!
- Like using a luggage lock on a bank vault

**Authentication (SHA-256, etc.)** = Tamper-evident seals
- ✓ Use SHA-256 or better
- ❌ Avoid SHA-1 and MD5 (they're broken)`
        },
        18: {
            title: "Diffie-Hellman Groups",
            notes: `**Think of Diffie-Hellman like creating a secret color:**

Imagine you and a friend want to create a secret color over video chat:
1. You start with the same base color (public)
2. You each mix in your secret color (private)
3. You swap the mixed colors
4. You each add your secret color to what you received
5. You both end up with the SAME final color, but nobody watching knows what it is!

**DH Groups** = Different levels of complexity

- **Group 1-2** ❌ = Like using only 3 colors (too easy to guess)
- **Group 5** ⚠️ = Using 10 colors (minimum acceptable)
- **Group 14** ✓ = Using 100 colors (standard today)
- **Group 15-18** ✓ = Using 1000s of colors (maximum security)
- **Elliptic Curve** ✓ = A smarter way to mix colors (more efficient)

**The bigger the group, the harder to crack, but the longer it takes to compute.**`
        },
        19: {
            title: "Outbound Processing",
            notes: `**Think of sending a secure package - step by step:**

1. **Check the rulebook (SPD)**: "Does this need protection?"
   - Like asking: "Is this confidential?"

2. **Decide what to do**: PROTECT, BYPASS, or DISCARD
   - Like: "Yes, this needs secure delivery"

3. **Find the contract (SAD)**: "Do we have a security agreement?"
   - Like checking if you have a courier account

4. **Create contract if needed (IKE)**: Set up security agreement
   - Like signing up for secure delivery service

5. **Pack securely**: Encrypt and seal the package
   - Put in locked box with tamper seal

6. **Send it**: Off it goes!`
        },
        20: {
            title: "Inbound Processing",
            notes: `**Think of receiving a secure package:**

1. **Identify**: "Is this a secure package?" (ESP or AH)
   - Like seeing "Registered Mail" on envelope

2. **Find instructions (SAD)**: Look up how to open this
   - Like checking your mailbox key number

3. **Check for replay**: "Is this a duplicate?"
   - Like checking ticket serial numbers

4. **Verify seal**: Make sure nobody tampered with it
   - Like checking tamper-evident tape

5. **Unlock**: Decrypt the contents
   - Use your key to open the box

6. **Remove packaging**: Strip off security layers
   - Take off all the protective wrapping

7. **Verify it's allowed**: Check it matches security policy
   - "Yes, we were expecting this"

8. **Deliver**: Give to the application
   - Hand package to recipient`
        },
        21: {
            title: "NAT Traversal",
            notes: `**Think of NAT like a mail forwarding service:**

**The Problem:**
Your apartment building (NAT) receives mail and changes the apartment numbers before forwarding.

**AH Problem**: Like registered mail that SEALS THE ENVELOPE ADDRESS
- If the forwarding service changes the address, the seal breaks!
- That's why AH doesn't work with NAT

**ESP Solution**: Only seals the contents, not the envelope
- The forwarding service can change addresses without breaking security

**NAT-T (NAT Traversal)** = Special handling for forwarded secure mail:
- Detects when there's a forwarding service
- Uses special packaging (UDP port 4500) that works better
- Sends keep-alive messages so forwarding service doesn't forget about you

**Real-world**: This is why ESP is used almost everywhere - it works with home routers and corporate firewalls.`
        },
        22: {
            title: "Performance Factors",
            notes: `**Think about what makes security fast or slow:**

**Crypto Overhead** = The time it takes to lock/unlock
- Hardware acceleration = automatic locks (super fast)
- Without it = manual combination locks (slower)
- Choose ChaCha20 if no hardware help

**MTU & Fragmentation** = Package size limits
- IPsec adds wrapping, making packages bigger
- Like adding bubble wrap - might need to split into multiple boxes
- Configure properly to avoid splitting

**Mode Selection** = Different packaging methods
- Transport = Less wrapping (faster)
- Tunnel = More wrapping (safer but slower)

**SA Establishment** = Setting up the secure channel
- Phase 1 is expensive (like building a secure tunnel)
- Keep it open longer to amortize the cost
- Like keeping a tunnel open instead of rebuilding it each time`
        },
        23: {
            title: "Security Best Practices",
            notes: `**Think of these as your security checklist:**

**Algorithms** = Choose strong locks
- ✓ Use AES-256 or ChaCha20 (modern deadbolts)
- ✓ Use SHA-256 or better (good seals)
- ✓ Use DH Group 14+ (complex secret handshakes)
- ❌ Avoid old, broken locks (3DES, SHA-1)

**Key Management** = How you handle your keys
- Use IKE (automatic key creation and rotation)
- Use certificates when possible (better than shared passwords)
- Change keys regularly (don't use same lock forever)

**Policy** = Write good security rules
- Least privilege (only protect what needs it)
- Review regularly (update your rulebook)
- Always use encryption AND authentication together

**Operations** = Day-to-day security hygiene
- Monitor logs (watch for break-in attempts)
- Apply updates (fix discovered vulnerabilities)
- Test backups (make sure failover works)
- Document everything (so you remember how it works!)`
        },
        24: {
            title: "Deployment Scenarios",
            notes: `**Think of these as different security setups:**

**Site-to-Site VPN** 🏢 ↔️ 🏢
- Like a secure tunnel between two office buildings
- All traffic goes through automatically
- Employees don't even know it's happening

**Remote Access VPN** 💻 → 🏢
- Like calling into the office on a secure line
- Employee's laptop connects to company
- Works from coffee shops, home, etc.

**Host-to-Host** 💻 ↔️ 💻
- Like two people speaking in code directly
- Both computers handle security themselves
- More efficient, but both need to know how

**Hybrid Cloud** 🏢 ↔️ ☁️
- Like extending your office into a cloud datacenter
- On-premises equipment connects securely to cloud
- Your company data stays encrypted in transit

**Choose based on:**
- Who needs to talk to whom?
- Do devices support IPsec directly?
- How many devices/networks are involved?`
        },
        25: {
            title: "Conclusion",
            notes: `**The Big Picture:**

**IPsec is like a universal security system for the internet**, providing four key protections:
1. Privacy (encryption)
2. Authenticity (authentication)
3. Integrity (tamper detection)
4. Freshness (anti-replay)

**Why it matters:**
- Works at the network layer (protects EVERYTHING)
- Industry standard (everyone speaks it)
- Flexible (works from one computer to entire datacenters)
- Proven (used in banking, government, military)

**Key takeaways:**
- ESP is the modern choice (encryption + authentication + NAT-friendly)
- IKEv2 is better than IKEv1 (use it for new deployments)
- Use strong algorithms (AES-256, SHA-256, DH Group 14+)
- Two phases: expensive setup (Phase 1), quick data protection (Phase 2)

**Think of IPsec as the foundation of secure networking** - just like HTTPS protects websites, IPsec protects everything at the network level.`
        },
        26: {
            title: "References",
            notes: `**Where to learn more:**

The full technical documentation (ipsec-architecture-report.md) contains detailed references from:
- Official RFCs (IETF standards documents)
- University research papers
- Vendor documentation (Cisco, Palo Alto, etc.)
- Technical blogs and tutorials

**For deeper understanding:**
- RFC 4301: The official IPsec architecture specification
- Cisco/Palo Alto documentation: Real-world implementation guides
- University papers: Academic analysis and research

**Remember:** Start with high-level concepts, then dive into specific RFCs and vendor docs as needed for implementation.`
        }
    };

    // Elements
    const slidesContainer = document.getElementById('slidesContainer');
    const slideNav = document.getElementById('slideNav');
    const slideCounter = document.getElementById('slideCounter');
    const prevButton = document.getElementById('prevSlide');
    const nextButton = document.getElementById('nextSlide');
    const notesButton = document.getElementById('notesButton');
    const notesPanel = document.getElementById('notesPanel');
    const notesClose = document.getElementById('notesClose');
    const notesContent = document.getElementById('notesContent');

    // Get all slides
    const slides = Array.from(document.querySelectorAll('.slide'));
    const totalSlides = slides.length;
    let currentSlide = 0;
    let notesOpen = false;

    // Initialize
    function init() {
        createNavigationDots();
        updateSlideCounter();
        updateNavigationButtons();
        setupEventListeners();

        // Set initial slide
        goToSlide(0);
    }

    // Create navigation dots
    function createNavigationDots() {
        slides.forEach((slide, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slide-nav-dot');
            dot.setAttribute('data-slide', index);
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);

            if (index === 0) {
                dot.classList.add('active');
            }

            dot.addEventListener('click', () => goToSlide(index));
            slideNav.appendChild(dot);
        });
    }

    // Update slide counter
    function updateSlideCounter() {
        slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
    }

    // Update navigation buttons
    function updateNavigationButtons() {
        prevButton.disabled = currentSlide === 0;
        nextButton.disabled = currentSlide === totalSlides - 1;
    }

    // Update navigation dots
    function updateNavigationDots() {
        const dots = document.querySelectorAll('.slide-nav-dot');
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Go to specific slide
    function goToSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= totalSlides) {
            return;
        }

        currentSlide = slideIndex;

        // Smooth scroll to slide
        const slideWidth = slides[slideIndex].offsetWidth;
        slidesContainer.scrollTo({
            left: slideWidth * slideIndex,
            behavior: 'smooth'
        });

        updateSlideCounter();
        updateNavigationButtons();
        updateNavigationDots();

        // Update notes content if panel is open
        if (notesOpen) {
            updateNotesContent(currentSlide);
        }
    }

    // Navigate to next slide
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
        }
    }

    // Navigate to previous slide
    function previousSlide() {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    }

    // Toggle notes panel
    function toggleNotes() {
        notesOpen = !notesOpen;
        if (notesOpen) {
            notesPanel.classList.add('open');
            updateNotesContent(currentSlide);
        } else {
            notesPanel.classList.remove('open');
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Notes button
        const notesButton = document.getElementById('notesButton');
        if (notesButton) {
            notesButton.addEventListener('click', toggleNotes);
        }
        if (notesClose) {
            notesClose.addEventListener('click', toggleNotes);
        }

        // Arrow buttons
        prevButton.addEventListener('click', previousSlide);
        nextButton.addEventListener('click', nextSlide);

        // Notes panel
        notesButton.addEventListener('click', toggleNotes);
        notesClose.addEventListener('click', closeNotes);

        // Close notes when clicking outside
        notesPanel.addEventListener('click', (e) => {
            if (e.target === notesPanel) {
                closeNotes();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyPress);

        // Scroll detection
        let scrollTimeout;
        slidesContainer.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(detectCurrentSlide, 100);
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        slidesContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        slidesContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next slide
                    nextSlide();
                } else {
                    // Swipe right - previous slide
                    previousSlide();
                }
            }
        }

        // Mouse wheel navigation (optional - can be disabled if too sensitive)
        let wheelTimeout;
        slidesContainer.addEventListener('wheel', (e) => {
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                if (e.deltaX > 0 || e.deltaY > 0) {
                    nextSlide();
                } else if (e.deltaX < 0 || e.deltaY < 0) {
                    previousSlide();
                }
            }, 50);
        }, { passive: true });
    }

    // Handle keyboard navigation
    function handleKeyPress(e) {
        switch(e.key) {
            case 'ArrowRight':
            case ' ': // Spacebar
            case 'PageDown':
                e.preventDefault();
                nextSlide();
                break;
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault();
                previousSlide();
                break;
            case 'Home':
                e.preventDefault();
                goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                goToSlide(totalSlides - 1);
                break;
            case 'n':
            case 'N':
                e.preventDefault();
                toggleNotes();
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                // Prevent default vertical scrolling
                e.preventDefault();
                break;
        }
    }

    // Detect current slide based on scroll position
    function detectCurrentSlide() {
        const scrollLeft = slidesContainer.scrollLeft;
        const slideWidth = slides[0].offsetWidth;
        const detectedSlide = Math.round(scrollLeft / slideWidth);

        if (detectedSlide !== currentSlide && detectedSlide >= 0 && detectedSlide < totalSlides) {
            currentSlide = detectedSlide;
            updateSlideCounter();
            updateNavigationButtons();
            updateNavigationDots();
        }
    }

    // Prevent vertical scrolling
    document.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
            e.preventDefault();
        }
    }, { passive: false });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            goToSlide(currentSlide);
        }, 250);
    });

    // Add presentation mode functionality (fullscreen on F11 or double-click)
    document.addEventListener('dblclick', (e) => {
        if (e.target.classList.contains('slide') || e.target.closest('.slide')) {
            toggleFullscreen();
        }
    });

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // Add help overlay (press '?' to show shortcuts)
    let helpOverlay = null;

    document.addEventListener('keydown', (e) => {
        if (e.key === '?' && !e.shiftKey) {
            e.preventDefault();
            showHelp();
        } else if (e.key === 'Escape') {
            if (helpOverlay) {
                hideHelp();
            } else if (notesOpen) {
                closeNotes();
            }
        }
    });

    function showHelp() {
        if (helpOverlay) return;

        helpOverlay = document.createElement('div');
        helpOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(10, 14, 39, 0.95);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
        `;

        const helpContent = document.createElement('div');
        helpContent.style.cssText = `
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 2rem;
            max-width: 600px;
            color: var(--text-primary);
        `;

        helpContent.innerHTML = `
            <h2 style="color: var(--accent-cyan); margin-bottom: 1.5rem;">Keyboard Shortcuts</h2>
            <div style="display: grid; gap: 1rem;">
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--accent-blue); font-weight: 600;">→ / Space / Page Down</span>
                    <span>Next slide</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--accent-blue); font-weight: 600;">← / Page Up</span>
                    <span>Previous slide</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--accent-blue); font-weight: 600;">Home</span>
                    <span>First slide</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--accent-blue); font-weight: 600;">End</span>
                    <span>Last slide</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--accent-blue); font-weight: 600;">N</span>
                    <span>Toggle presentation notes</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--accent-blue); font-weight: 600;">F11</span>
                    <span>Fullscreen</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--accent-blue); font-weight: 600;">Double-click</span>
                    <span>Toggle fullscreen</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--accent-blue); font-weight: 600;">?</span>
                    <span>Show this help</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--accent-blue); font-weight: 600;">Esc</span>
                    <span>Close help / notes</span>
                </div>
            </div>
            <p style="margin-top: 1.5rem; text-align: center; color: var(--text-secondary); font-size: 0.9rem;">
                Press ESC to close
            </p>
        `;

        helpOverlay.appendChild(helpContent);
        document.body.appendChild(helpOverlay);

        helpOverlay.addEventListener('click', (e) => {
            if (e.target === helpOverlay) {
                hideHelp();
            }
        });
    }

    function hideHelp() {
        if (helpOverlay) {
            helpOverlay.remove();
            helpOverlay = null;
        }
    }

    // Add loading animation
    document.addEventListener('DOMContentLoaded', () => {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s';
            document.body.style.opacity = '1';
        }, 100);
    });

    // Notes Panel Functions
    function openNotes() {
        notesOpen = true;
        notesPanel.classList.add('open');
        updateNotesContent(currentSlide);
    }

    function closeNotes() {
        notesOpen = false;
        notesPanel.classList.remove('open');
    }

    function toggleNotes() {
        if (notesOpen) {
            closeNotes();
        } else {
            openNotes();
        }
    }

    function updateNotesContent(slideIndex) {
        const slideNumber = slideIndex + 1;
        const noteData = slideNotes[slideNumber];

        if (noteData && notesContent) {
            // Convert markdown-style formatting to HTML
            let formattedNotes = noteData.notes
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Bold
                .replace(/`(.+?)`/g, '<code>$1</code>') // Code
                .replace(/^### (.+)$/gm, '<h4>$1</h4>') // H4 headers
                .replace(/^## (.+)$/gm, '<h3>$1</h3>') // H3 headers
                .replace(/^- (.+)$/gm, '<li>$1</li>') // List items
                .replace(/\n\n/g, '</p><p>') // Paragraphs
                .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>') // Wrap lists
                .replace(/<\/ul>\s*<ul>/g, ''); // Merge adjacent lists

            notesContent.innerHTML = `
                <div class="notes-slide-title">
                    <span class="notes-slide-number">Slide ${slideNumber}</span>
                    <h3>${noteData.title}</h3>
                </div>
                <div class="notes-body">
                    <p>${formattedNotes}</p>
                </div>
            `;
        } else {
            notesContent.innerHTML = `
                <div class="notes-slide-title">
                    <span class="notes-slide-number">Slide ${slideNumber}</span>
                </div>
                <div class="notes-body">
                    <p>No presentation notes available for this slide.</p>
                </div>
            `;
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Add progress indicator
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple));
        transition: width 0.3s ease;
        z-index: 10001;
    `;
    document.body.appendChild(progressBar);

    function updateProgress() {
        const progress = ((currentSlide + 1) / totalSlides) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Update progress on slide change
    const originalGoToSlide = goToSlide;
    goToSlide = function(slideIndex) {
        originalGoToSlide(slideIndex);
        updateProgress();
    };

    // Preload hint
    const preloadHint = document.createElement('div');
    preloadHint.style.cssText = `
        position: fixed;
        bottom: 5rem;
        left: 50%;
        transform: translateX(-50%);
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        padding: 0.75rem 1.5rem;
        border-radius: 20px;
        color: var(--text-secondary);
        font-size: 0.9rem;
        z-index: 1000;
        opacity: 1;
        transition: opacity 0.5s;
    `;
    preloadHint.textContent = 'Press ? for keyboard shortcuts';
    document.body.appendChild(preloadHint);

    // Hide hint after 5 seconds
    setTimeout(() => {
        preloadHint.style.opacity = '0';
        setTimeout(() => {
            preloadHint.remove();
        }, 500);
    }, 5000);

})();
