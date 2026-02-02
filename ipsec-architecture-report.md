# IP Security (IPsec) Architecture: A Comprehensive Technical Documentation

**Author:** Technical Documentation Team  
**Date:** February 2, 2026  
**Document Type:** Technical Report

---

## Table of Contents

\begin{itemize}
\item Executive Summary
\item Introduction
  \begin{itemize}
  \item Overview of IPsec
  \item Purpose and Objectives
  \item Scope of this Documentation
  \end{itemize}
\item IPsec Architecture Overview
  \begin{itemize}
  \item Fundamental Concepts
  \item Protocol Suite Components
  \item Security Services Provided
  \end{itemize}
\item Core IPsec Protocols
  \begin{itemize}
  \item Authentication Header (AH)
  \item Encapsulating Security Payload (ESP)
  \item Internet Key Exchange (IKE)
  \end{itemize}
\item IPsec Operational Modes
  \begin{itemize}
  \item Transport Mode
  \item Tunnel Mode
  \item Mode Comparison and Use Cases
  \end{itemize}
\item Security Association (SA) Framework
  \begin{itemize}
  \item Security Association Concepts
  \item Security Parameter Index (SPI)
  \item SA Establishment and Management
  \end{itemize}
\item IPsec Databases
  \begin{itemize}
  \item Security Policy Database (SPD)
  \item Security Association Database (SAD)
  \item Peer Authorization Database (PAD)
  \end{itemize}
\item Internet Key Exchange (IKE) Protocol
  \begin{itemize}
  \item IKE Phase 1 - ISAKMP Tunnel Establishment
  \item IKE Phase 2 - IPsec SA Negotiation
  \item IKEv1 vs IKEv2
  \end{itemize}
\item Cryptographic Algorithms
  \begin{itemize}
  \item Encryption Algorithms
  \item Authentication and Integrity Algorithms
  \item Key Exchange Mechanisms
  \end{itemize}
\item Packet Processing and Flow
  \begin{itemize}
  \item Outbound Packet Processing
  \item Inbound Packet Processing
  \item NAT Traversal Considerations
  \end{itemize}
\item Implementation Considerations
  \begin{itemize}
  \item Performance Factors
  \item Security Best Practices
  \item Common Deployment Scenarios
  \end{itemize}
\item Conclusion
\item References
\end{itemize}

---

## Executive Summary

IP Security (IPsec) represents a comprehensive framework of open standards for ensuring secure communications over Internet Protocol (IP) networks. As a network-layer security protocol suite, IPsec authenticates and encrypts packets of data to provide confidential, authenticated communication between computers, security gateways, and networks[1].

This technical documentation provides an in-depth analysis of IPsec architecture, covering its core protocols (Authentication Header and Encapsulating Security Payload), operational modes (transport and tunnel), security association framework, key management through Internet Key Exchange (IKE), and the cryptographic algorithms that underpin its security guarantees. The document serves as a comprehensive reference for network security professionals, system administrators, and technical personnel responsible for implementing and maintaining IPsec-based security solutions.

---

## Introduction

### Overview of IPsec

IPsec is a secure network protocol suite that operates at the network layer (Layer 3) of the OSI model, providing security services for IP datagrams. Unlike application-layer security protocols such as TLS/SSL, IPsec operates transparently to applications and can protect all traffic flowing between configured endpoints[1][4].

The protocol suite was designed to address fundamental security requirements in IP communications:

\begin{itemize}
\item \textbf{Confidentiality:} Ensuring data transmitted cannot be read by unauthorized parties
\item \textbf{Data Integrity:} Guaranteeing data has not been tampered with during transmission
\item \textbf{Authentication:} Verifying the identity of communicating parties
\item \textbf{Anti-replay Protection:} Preventing attackers from capturing and retransmitting valid packets
\end{itemize}

### Purpose and Objectives

The primary objectives of IPsec include:

1. **Network-Layer Security:** Providing comprehensive security at the IP layer, protecting all protocols and applications that operate above it
2. **Interoperability:** Establishing open standards that enable different vendors' implementations to communicate securely
3. **Flexibility:** Supporting various cryptographic algorithms and security policies to meet diverse security requirements
4. **Scalability:** Enabling secure communications from individual host-to-host connections to large site-to-site VPN deployments

### Scope of this Documentation

This documentation examines the architectural components of IPsec, including protocol specifications, operational modes, security association management, key exchange mechanisms, and cryptographic implementations. The report provides technical details necessary for understanding IPsec design principles and practical deployment considerations.

---

## IPsec Architecture Overview

### Fundamental Concepts

The IPsec architecture is built upon several fundamental concepts that work together to provide comprehensive security services[10][17]:

\begin{enumerate}
\item \textbf{Security Protocols:} AH and ESP protocols that provide authentication and encryption
\item \textbf{Security Associations:} Unidirectional connections defining security parameters between peers
\item \textbf{Key Management:} IKE protocol for automated negotiation and establishment of security parameters
\item \textbf{Cryptographic Algorithms:} Modular support for various encryption and authentication algorithms
\item \textbf{Policy Enforcement:} Databases (SPD, SAD, PAD) that define and enforce security policies
\end{enumerate}

### Protocol Suite Components

IPsec comprises multiple components that collectively provide its security functionality[4][7]:

\begin{table}
\begin{tabular}{|l|p{10cm}|}
\hline
\textbf{Component} & \textbf{Function} \\
\hline
Authentication Header (AH) & Provides connectionless data integrity, data origin authentication, and anti-replay protection \\
\hline
Encapsulating Security Payload (ESP) & Provides confidentiality, data integrity, authentication, and limited traffic-flow confidentiality \\
\hline
Internet Key Exchange (IKE) & Automates SA creation and key exchange between communicating parties \\
\hline
Security Association (SA) & Defines security parameters and shared attributes between peers \\
\hline
Security Policy Database (SPD) & Specifies policies determining disposition of IP traffic \\
\hline
Security Association Database (SAD) & Contains parameters for each established SA \\
\hline
\end{tabular}
\caption{IPsec Protocol Suite Components}
\end{table}

### Security Services Provided

IPsec provides the following security services through its protocol implementations[1][8]:

**Authentication and Integrity:** Both AH and ESP offer origin authentication and integrity services, ensuring IPsec peers are legitimate and data has not been modified in transit. AH provides integrity checking for the entire IP packet including immutable header fields, while ESP authenticates only the encrypted payload[2][8].

**Confidentiality:** ESP provides encryption of IP packet payloads, ensuring data confidentiality during transmission. The encryption protects the contents from unauthorized access even if packets are intercepted[1][5].

**Anti-Replay Protection:** Both protocols include optional anti-replay services using sequence numbers to detect and reject duplicate or replayed packets, preventing attackers from exploiting captured packets[4][10].

**Limited Traffic-Flow Confidentiality:** ESP in tunnel mode can hide original source and destination addresses, providing protection against traffic analysis by encrypting the entire original IP packet[6][9].

---

## Core IPsec Protocols

### Authentication Header (AH)

The Authentication Header protocol (IP protocol number 51) provides connectionless data integrity and data origin authentication for IP datagrams[1][5].

**AH Functionality:**

Authentication Header offers authentication for as much of the IP header as possible, computing a Message Authentication Code (MAC) over immutable fields of the IP header, the AH header itself, and the payload[5][8]. Fields that may change during transit (such as TTL, TOS, flags, fragment offset, and header checksum) are excluded from authentication or set to zero for calculation purposes[5].

**AH Packet Structure:**

\begin{table}
\begin{tabular}{|l|p{10cm}|}
\hline
\textbf{Field} & \textbf{Description} \\
\hline
Next Header & Identifies the protocol following the AH header \\
\hline
Payload Length & Length of AH header in 32-bit words minus 2 \\
\hline
Reserved & Reserved for future use (set to zero) \\
\hline
Security Parameter Index (SPI) & Identifies the security association \\
\hline
Sequence Number & Counter value providing anti-replay protection \\
\hline
Authentication Data & Contains the Integrity Check Value (ICV) \\
\hline
\end{tabular}
\caption{AH Header Fields}
\end{table}

**AH Limitations:**

AH has notable limitations in modern network environments. It creates an integrity check on the outer IP header, which causes compatibility issues with Network Address Translation (NAT) since NAT modifies IP addresses[2]. This incompatibility has led to AH being less commonly deployed compared to ESP, which does not authenticate the outer header and therefore traverses NAT devices more successfully[2][14].

Additionally, AH provides no confidentiality—all data remains in cleartext[2][5]. For scenarios requiring encryption, AH must be combined with ESP, though modern practice typically uses ESP alone with authentication enabled.

### Encapsulating Security Payload (ESP)

The Encapsulating Security Payload protocol (IP protocol number 50) provides confidentiality through encryption, along with optional authentication, integrity, and anti-replay services[1][8].

**ESP Functionality:**

ESP encrypts the payload data and optionally authenticates both the payload and ESP header. Unlike AH, ESP does not protect the outer IP header, focusing instead on protecting the encapsulated data[5][8]. This design makes ESP compatible with NAT environments while still providing strong security guarantees for the actual data being transmitted.

**ESP Packet Structure:**

The ESP protocol uses both a header and trailer structure that "surrounds" the protected data[5][10]:

\begin{table}
\begin{tabular}{|l|p{10cm}|}
\hline
\textbf{Field} & \textbf{Description} \\
\hline
Security Parameter Index (SPI) & Identifies the security association \\
\hline
Sequence Number & Provides anti-replay protection \\
\hline
Payload Data & Encrypted actual data (variable length) \\
\hline
Padding & Ensures proper block alignment for encryption algorithms \\
\hline
Pad Length & Indicates number of padding bytes \\
\hline
Next Header & Identifies protocol of encrypted payload \\
\hline
Authentication Data & Optional ICV for authentication (if enabled) \\
\hline
\end{tabular}
\caption{ESP Packet Fields}
\end{table}

**ESP Operational Modes:**

ESP can be configured to operate in different modes depending on security requirements[7][8]:

\begin{itemize}
\item \textbf{ESP with Encryption Only:} Provides confidentiality without authentication
\item \textbf{ESP with Authentication Only:} Functions similar to AH but without outer header protection (using null encryption)
\item \textbf{ESP with Encryption and Authentication:} Provides both confidentiality and authentication (most common deployment)
\end{itemize}

**ESP Advantages:**

ESP's design makes it more practical for modern deployments. It provides confidentiality through encryption, works seamlessly with NAT devices, and can optionally provide authentication services comparable to AH[2][8]. The null encryption algorithm proposed for ESP effectively makes AH redundant in most scenarios[5].

### Internet Key Exchange (IKE)

Internet Key Exchange is the protocol responsible for automating Security Association creation and managing cryptographic key exchange between IPsec peers[7][16]. IKE eliminates the need for manual key configuration and provides mechanisms for secure key refresh.

**IKE Primary Functions:**

\begin{enumerate}
\item \textbf{Mutual Authentication:} Verifying the identity of both communicating parties using pre-shared keys, digital certificates, or public key encryption[19][22]
\item \textbf{Key Material Generation:} Establishing shared symmetric keys through secure key exchange mechanisms[16][25]
\item \textbf{SA Negotiation:} Agreeing on security parameters including encryption and authentication algorithms[19][22]
\item \textbf{Key Refresh:} Managing periodic key renewal to maintain security over time[7]
\end{enumerate}

**IKE Operational Structure:**

IKE operates in two distinct phases, each serving specific purposes in establishing secure communications[16][19][22]:

- **Phase 1:** Establishes a secure, authenticated channel (IKE SA or ISAKMP tunnel) for subsequent negotiations
- **Phase 2:** Uses the secure Phase 1 channel to negotiate IPsec Security Associations for actual data protection

This two-phase approach separates the computationally expensive mutual authentication and key exchange (Phase 1) from the potentially frequent IPsec SA establishments (Phase 2), improving overall performance[27].

---

## IPsec Operational Modes

IPsec can operate in two distinct modes that determine how packets are encapsulated and what portions of the original packet are protected: Transport Mode and Tunnel Mode[3][6][9].

### Transport Mode

Transport mode protects only the payload of the IP packet while retaining the original IP header[3][6][15].

**Transport Mode Characteristics:**

\begin{itemize}
\item The original IP header remains exposed and unmodified (except protocol field)
\item Only the data payload is encrypted (ESP) or authenticated (AH)
\item IPsec header is inserted between the original IP header and the payload
\item Lower overhead compared to tunnel mode due to single IP header
\item Larger Maximum Transmission Unit (MTU) preserved[6][15]
\end{itemize}

**Transport Mode Packet Structure:**

For ESP in transport mode, the structure is[2][6][15]:

[Original IP Header][ESP Header][Encrypted TCP/UDP Header + Data][ESP Trailer][ESP Auth]

For AH in transport mode[5]:

[Original IP Header][AH Header][TCP/UDP Header + Data]

**Transport Mode Use Cases:**

Transport mode is primarily used for host-to-host communications where both endpoints support IPsec[3][7][15]. Common scenarios include:

\begin{itemize}
\item Direct encrypted communication between two servers
\item Client-to-server VPN connections where the client has IPsec capability
\item End-to-end security between IPsec-aware applications
\item L2TP over IPsec implementations (IPsec in transport mode protecting L2TP tunnel)[12]
\end{itemize}

### Tunnel Mode

Tunnel mode encapsulates the entire original IP packet (header and payload) within a new IP packet[3][6][9].

**Tunnel Mode Characteristics:**

\begin{itemize}
\item Complete original IP packet is treated as payload
\item New outer IP header is created with tunnel endpoint addresses
\item Original IP header is encrypted (when using ESP), hiding internal routing information
\item Higher overhead due to additional IP header
\item Reduced MTU requiring careful configuration to avoid fragmentation[6][15]
\end{itemize}

**Tunnel Mode Packet Structure:**

For ESP in tunnel mode[5][6]:

[New IP Header][ESP Header][Encrypted: Original IP Header + Data][ESP Trailer][ESP Auth]

For AH in tunnel mode[5]:

[New IP Header][AH Header][Original IP Header + Data]

**Tunnel Mode Use Cases:**

Tunnel mode is mandatory when at least one peer is a security gateway applying IPsec on behalf of other hosts[6][9]. Common deployments include:

\begin{itemize}
\item Site-to-site VPNs connecting entire networks across the Internet[3][7]
\item Security gateway to security gateway connections
\item Remote access VPNs where the VPN gateway terminates IPsec tunnels
\item Scenarios requiring protection against traffic analysis[6][9]
\end{itemize}

**Tunnel Mode Advantages:**

Tunnel mode offers several strategic advantages[6][9]:

1. **Traffic Analysis Protection:** Encrypting the original IP header prevents attackers from determining which internal hosts are communicating
2. **Gateway Compatibility:** Security gateways can provide IPsec protection for hosts that don't support IPsec natively
3. **NAT Traversal:** Tunnel mode facilitates easier traversal of NAT devices in VPN scenarios[6]
4. **Network Isolation:** Keeps internal IP addressing schemes private from external networks

### Mode Comparison and Use Cases

\begin{table}
\begin{tabular}{|l|p{5cm}|p{5cm}|}
\hline
\textbf{Aspect} & \textbf{Transport Mode} & \textbf{Tunnel Mode} \\
\hline
Header Protection & Original header exposed & Original header encrypted (ESP) \\
\hline
Overhead & Lower (single IP header) & Higher (dual IP headers) \\
\hline
MTU & Original MTU maintained & Reduced MTU \\
\hline
Endpoints & Must both support IPsec & Can use security gateways \\
\hline
Use Case & Host-to-host direct & Site-to-site, remote access VPNs \\
\hline
Traffic Analysis & Source/dest visible & Tunnel endpoints only visible \\
\hline
Complexity & Less complex processing & More complex encapsulation \\
\hline
\end{tabular}
\caption{Transport Mode vs Tunnel Mode Comparison}
\end{table}

**Selection Criteria:**

When determining which mode to use[7][9][15]:

- **Choose Transport Mode** when both endpoints natively support IPsec, lower overhead is critical, or using IPsec with another tunneling protocol (GRE, L2TP)[12]
- **Choose Tunnel Mode** when connecting networks, using security gateways, protecting against traffic analysis, or requiring compatibility with hosts that don't support IPsec

---

## Security Association (SA) Framework

### Security Association Concepts

A Security Association (SA) is a fundamental management construct in IPsec that establishes shared security attributes between communicating parties[1][17][20]. An SA represents a unidirectional logical connection that specifies the security services, mechanisms, and keys to be applied to traffic flowing in one direction[20][26].

**SA Unidirectional Nature:**

Because SAs are unidirectional, bidirectional communication requires two separate Security Associations—one for each direction[20][26]. For example, if Host A and Host B communicate, one SA protects traffic from A to B, and a separate SA protects traffic from B to A. This design provides flexibility in applying asymmetric security policies when needed.

**SA Parameters:**

Each Security Association contains comprehensive information defining how to process packets[20][26][27]:

\begin{itemize}
\item Security protocol (AH or ESP)
\item Security Parameter Index (SPI)
\item Sequence number counter for anti-replay protection
\item Cryptographic algorithm and key for encryption
\item Authentication algorithm and key for integrity
\item SA lifetime (expressed in time duration or data volume)
\item IPsec mode (transport or tunnel)
\item Path Maximum Transmission Unit (PMTU)
\item Source and destination IP addresses
\end{itemize}

### Security Parameter Index (SPI)

The Security Parameter Index is a 32-bit value carried in AH and ESP headers that, combined with the destination IP address and security protocol identifier, uniquely identifies a Security Association[1][17][20].

**SPI Functionality:**

When an IPsec-protected packet arrives, the receiving system uses the SPI value along with the destination address to look up the corresponding SA in the Security Association Database[1][23]. This lookup retrieves the decryption keys, authentication algorithms, and other parameters needed to process the packet.

**SPI Assignment:**

SPI values are assigned during SA establishment, typically during IKE Phase 2 negotiations[26]. Values 0-255 are reserved by IANA for future use; all other values can be freely assigned. Each endpoint assigns the SPI value for inbound SAs, ensuring the SPI is meaningful to the receiver.

**Multicast Considerations:**

For multicast SAs, the SA lookup may use the combination of destination address, source address, and SPI to uniquely identify the security association, as multiple sources may be sending to the same multicast group[17].

### SA Establishment and Management

**SA Creation Methods:**

Security Associations can be established through two approaches[7][17]:

1. **Manual Configuration:** Administrator manually configures all SA parameters including keys on both endpoints. This approach does not scale well and lacks key refresh capabilities, making it suitable only for simple, static deployments.

2. **Dynamic Negotiation via IKE:** IKE protocol automatically negotiates and establishes SAs, including cryptographic key generation and periodic refresh[16][25]. This is the predominant method in production deployments.

**SA Lifetime Management:**

Each SA has a defined lifetime based on time duration (e.g., 3600 seconds) or data volume (e.g., 100 MB)[20][27]. Before an SA expires, IKE negotiates a new SA to ensure uninterrupted communications. This regular key refresh enhances security by limiting the amount of data encrypted with any single key[7].

**SA Database Storage:**

All active Security Associations and their parameters are stored in the Security Association Database (SAD)[17][20][23]. The SAD enables the system to quickly locate the appropriate SA for packet processing based on SPI and destination address lookups.

---

## IPsec Databases

IPsec architecture defines three critical databases that work together to enforce security policy and manage active security associations[17][23].

### Security Policy Database (SPD)

The Security Policy Database specifies the security policies that determine how IP traffic should be handled[17][23]. The SPD defines rules that classify packets and determine whether they should be protected by IPsec, bypassed, or discarded.

**SPD Structure:**

The SPD is implemented as an ordered database similar to firewall Access Control Lists (ACLs)[17]. The ordering is essential because entries often overlap due to ranges in selector values. Packets are matched against SPD entries in order, with the first matching entry determining the packet's disposition[17].

**SPD Logical Division:**

The SPD is logically divided into three components[17]:

\begin{itemize}
\item \textbf{SPD-S (Secure):} Contains entries for all traffic subject to IPsec protection
\item \textbf{SPD-O (Outbound):} Contains entries for outbound traffic to be bypassed or discarded
\item \textbf{SPD-I (Inbound):} Contains entries for inbound traffic to be bypassed or discarded
\end{itemize}

**Packet Selectors:**

SPD entries use selectors to match packets[17][23]:

\begin{itemize}
\item Source and destination IP addresses (ranges or individual addresses)
\item Protocol (TCP, UDP, ICMP, etc.)
\item Source and destination ports
\item Upper-layer protocols
\end{itemize}

**Processing Actions:**

For each SPD entry, one of three actions is specified[17][23]:

1. **PROTECT:** Apply IPsec security (specify which protocol, mode, algorithms)
2. **BYPASS:** Allow packet to pass without IPsec processing
3. **DISCARD:** Drop the packet

**SPD Example Entry:**

An example SPD entry might specify: "All TCP traffic from 192.168.1.0/24 to 10.0.0.0/8 on port 443 must be protected using ESP in tunnel mode with AES-256 encryption and SHA-256 authentication."

### Security Association Database (SAD)

The Security Association Database stores all active Security Associations and their associated parameters[17][20][23]. While the SPD defines policy, the SAD contains the actual operational parameters for active connections.

**SAD Contents:**

Each SAD entry corresponds to one Security Association and includes[20][26]:

\begin{itemize}
\item Security Parameter Index (SPI)
\item Destination IP address (and source address for multicast)
\item IPsec protocol (AH or ESP)
\item Sequence number counter (for anti-replay)
\item Anti-replay window size
\item Cryptographic algorithm and keys
\item SA lifetime (time or data volume)
\item IPsec mode (transport or tunnel)
\item Path MTU information
\end{itemize}

**SAD Lookup Process:**

For outbound packets, the system first consults the SPD to determine if IPsec protection is required. If so, the SPD entry points to the appropriate SAD entry (or triggers IKE to create one)[17][23]. For inbound packets, the system extracts the SPI from the packet header and looks up the corresponding SAD entry directly[1][20].

**SAD Lookup for Multicast:**

For multicast traffic, SAD lookup may require matching on the destination address, source address, and SPI together to uniquely identify the SA, since multiple sources may be transmitting to the same multicast group[17].

### Peer Authorization Database (PAD)

The Peer Authorization Database provides a link between IKE (the SA management protocol) and the SPD[17]. The PAD specifies which authenticated identities are authorized to establish SAs for particular traffic flows.

**PAD Functionality:**

The PAD helps answer questions such as: "Is this authenticated peer authorized to create an IPsec SA for traffic destined to this network?" This prevents scenarios where an attacker successfully authenticates but attempts to create SAs for unauthorized destinations[17].

**PAD Usage:**

When IKE receives a request to establish an SA, it authenticates the peer and then consults the PAD to verify the peer is authorized to create SAs matching the requested traffic selectors. This authorization check adds an important security layer beyond simple authentication.

---

## Internet Key Exchange (IKE) Protocol

### IKE Phase 1 - ISAKMP Tunnel Establishment

IKE Phase 1 establishes a secure, authenticated, bidirectional channel between IPsec peers called the IKE Security Association or ISAKMP tunnel[16][19][27]. This channel is then used to protect the Phase 2 negotiations.

**Phase 1 Objectives:**

\begin{enumerate}
\item Authenticate the identity of both peers
\item Negotiate and agree on security parameters (encryption and hashing algorithms)
\item Perform Diffie-Hellman key exchange to establish shared secret key material
\item Create a secure channel for Phase 2 negotiations[16][19][22]
\end{enumerate}

**Authentication Methods:**

Phase 1 supports multiple authentication methods[19][22][25]:

\begin{itemize}
\item \textbf{Pre-shared Keys (PSK):} Both parties share a secret passphrase configured manually
\item \textbf{Digital Certificates:} X.509 certificates issued by trusted Certificate Authorities
\item \textbf{Public Key Encryption:} RSA signatures or encryption
\end{itemize}

**Phase 1 Modes (IKEv1):**

IKEv1 defines two modes for Phase 1, each with different security and performance characteristics[16][19][22]:

**Main Mode:**

Main Mode uses six messages to establish the IKE SA, providing maximum security through identity protection[16][19][22]:

\begin{enumerate}
\item Messages 1-2: Negotiate and agree on security parameters (encryption and authentication algorithms)
\item Messages 3-4: Perform Diffie-Hellman key exchange (exchange public values)
\item Messages 5-6: Authenticate peer identities using the negotiated method
\end{enumerate}

Main Mode encrypts the identity information in messages 5-6, protecting it from eavesdroppers. This mode is more secure but requires six messages to complete[19][22].

**Aggressive Mode:**

Aggressive Mode accomplishes Phase 1 in just three messages but sacrifices identity protection[16][19][22]:

\begin{enumerate}
\item Message 1: Initiator sends all negotiation parameters, Diffie-Hellman public value, and identity
\item Message 2: Responder sends accepted parameters, its Diffie-Hellman value, and authenticates
\item Message 3: Initiator authenticates
\end{enumerate}

Aggressive Mode is faster but exposes peer identities to eavesdropping since they are transmitted before the secure channel is established[19][22]. This mode is useful when identity protection is not critical or when dynamic IP addresses are used.

**Diffie-Hellman Key Exchange:**

A crucial component of Phase 1 is the Diffie-Hellman key exchange, which allows both parties to establish a shared secret over an unsecured channel without any prior key exchange[19][25]. The shared secret derived from Diffie-Hellman is used to protect subsequent Phase 2 negotiations.

The Diffie-Hellman computation is cryptographically intensive, which is why Phase 1 is designed to be performed infrequently with the resulting IKE SA being reused for multiple Phase 2 negotiations[27].

**Phase 1 Outcome:**

Upon completion, Phase 1 produces the IKE Security Association—a secure, authenticated, encrypted channel between the peers with agreed-upon security parameters for protecting Phase 2 negotiations[27].

### IKE Phase 2 - IPsec SA Negotiation

Phase 2 operates within the secure channel established in Phase 1 to negotiate the actual IPsec Security Associations that protect user data[16][19][25][27].

**Phase 2 Objectives:**

\begin{enumerate}
\item Negotiate IPsec protocol (AH or ESP) and mode (transport or tunnel)
\item Select encryption and authentication algorithms for IPsec
\item Derive session keys for IPsec from Phase 1 key material
\item Establish unidirectional SAs (minimum of two for bidirectional communication)[19][25]
\end{enumerate}

**Quick Mode:**

Phase 2 always operates in Quick Mode, which uses three encrypted messages to establish IPsec SAs[19][22][27]. All Phase 2 messages are protected by the encryption and authentication established in Phase 1, ensuring confidentiality and integrity of SA negotiations.

**Proxy IDs:**

During Phase 2, both peers exchange "proxy IDs" that define the traffic to be protected by the IPsec tunnel[19][25]. Proxy IDs include:

\begin{itemize}
\item Local IP address or subnet
\item Remote IP address or subnet
\item Protocol (often "any" or specific protocol like TCP)
\item Ports (often "any" or specific ports)
\end{itemize}

Both peers must have matching proxy IDs—one peer's local ID should match the other peer's remote ID[25]. Mismatched proxy IDs are a common cause of Phase 2 failures.

**Perfect Forward Secrecy (PFS):**

Phase 2 can optionally perform an additional Diffie-Hellman exchange to provide Perfect Forward Secrecy[19]. PFS ensures that IPsec session keys are mathematically independent from Phase 1 keys and from each other, so compromise of one key does not compromise others. PFS adds computational overhead but significantly enhances security.

**Anti-Replay Protection:**

Phase 2 negotiation includes anti-replay protection mechanisms that use sequence numbers to detect and reject duplicate or replayed packets[19].

**Phase 2 Outcome:**

Upon completion, Phase 2 produces one or more IPsec Security Associations stored in the SAD[27]. These SAs define exactly how data packets will be encrypted and authenticated. Since SAs are unidirectional, a typical Phase 2 negotiation creates at least two SAs—one for each direction.

**SA Refresh:**

IPsec SAs have finite lifetimes. Before an SA expires, IKE automatically performs another Phase 2 negotiation to create fresh SAs, ensuring uninterrupted secure communications[7][25]. The Phase 1 IKE SA can be reused for multiple Phase 2 negotiations, avoiding the expensive Diffie-Hellman computation each time.

### IKEv1 vs IKEv2

**IKEv1:**

The original IKE specification (RFC 2409) includes the Phase 1 Main Mode and Aggressive Mode, along with Phase 2 Quick Mode described above[19].

**IKEv2:**

IKEv2 (RFC 4306) is a simplified, more efficient redesign that maintains the two-phase concept but streamlines the process[16][19]:

\begin{itemize}
\item Reduced message count and complexity
\item Built-in NAT traversal support
\item Improved reliability with explicit acknowledgments
\item Better support for remote access VPN scenarios
\item No Main Mode vs Aggressive Mode distinction—uses single exchange type
\item Enhanced DoS attack resistance
\end{itemize}

While IKEv1 remains widely deployed, IKEv2 is increasingly adopted in modern implementations due to its improved efficiency and security features[19].

---

## Cryptographic Algorithms

IPsec's security depends fundamentally on the cryptographic algorithms employed for encryption, authentication, and key exchange[1][7].

### Encryption Algorithms

IPsec supports various symmetric encryption algorithms to provide confidentiality. The most commonly deployed include[7][18]:

**AES (Advanced Encryption Standard):**

AES is the predominant encryption standard in modern IPsec deployments[18][21]. It operates as a block cipher with key sizes of 128, 192, or 256 bits. AES-256 provides the highest security margin and is widely recommended for sensitive data.

\begin{itemize}
\item \textbf{Strengths:} Extensively analyzed and proven secure, hardware acceleration available on most modern CPUs (AES-NI instruction set), excellent performance with hardware support[18][29]
\item \textbf{Use Cases:} Default choice for most IPsec implementations, particularly on systems with AES hardware acceleration, disk encryption, and high-throughput scenarios[29]
\end{itemize}

**ChaCha20:**

ChaCha20 is a modern stream cipher increasingly adopted in IPsec and other protocols[18][21][24]. It uses 256-bit keys and operates using Add-Rotate-XOR (ARX) operations that are computationally efficient in software[24].

\begin{itemize}
\item \textbf{Strengths:} Excellent software performance without hardware acceleration, constant-time operations resistant to timing attacks, simpler to implement correctly than AES modes[18][21][24]
\item \textbf{Use Cases:} Mobile devices without AES hardware acceleration, embedded and IoT systems, JavaScript-based cryptography, environments prioritizing implementation safety[18][29]
\item \textbf{Common Pairing:} ChaCha20 is typically paired with Poly1305 for authentication (ChaCha20-Poly1305 or XChaCha20-Poly1305)[24]
\end{itemize}

**Performance Comparison:**

AES with hardware acceleration (AES-NI) typically offers superior throughput on systems with such support, while ChaCha20 provides more consistent performance across diverse hardware platforms[18][21][29]. On mobile devices and systems without AES hardware, ChaCha20 often significantly outperforms software-based AES implementations[18][29].

**Legacy Algorithms:**

Older algorithms still found in some deployments include[7]:

\begin{itemize}
\item \textbf{3DES (Triple DES):} Legacy algorithm with 168-bit effective key strength, now considered inadequate for high-security applications
\item \textbf{DES:} Obsolete 56-bit encryption, should not be used due to vulnerability to brute-force attacks
\item \textbf{Blowfish:} Older block cipher, largely superseded by AES
\end{itemize}

Modern IPsec implementations should use AES or ChaCha20 and avoid legacy algorithms.

### Authentication and Integrity Algorithms

Authentication algorithms ensure data integrity and origin authentication by computing Message Authentication Codes (MACs) or cryptographic hashes[1][4][10].

**Common Hash Functions:**

\begin{itemize}
\item \textbf{SHA-256 (SHA-2 family):} Produces 256-bit hash values, widely recommended for modern deployments[1][4]
\item \textbf{SHA-384, SHA-512:} Larger hash sizes providing additional security margin
\item \textbf{BLAKE2:} Modern hash function offering high performance[1]
\item \textbf{SHA-1:} Legacy algorithm considered cryptographically weak, should be avoided[4]
\item \textbf{MD5:} Obsolete and cryptographically broken, must not be used
\end{itemize}

**HMAC Construction:**

IPsec typically uses Hash-based Message Authentication Code (HMAC) construction, which combines the hash function with a secret key to produce an authentication tag[4][8]. For example, HMAC-SHA256 uses SHA-256 in an HMAC construction to authenticate packets.

**Poly1305:**

Poly1305 is a modern MAC algorithm specifically designed for use with ChaCha20 encryption[18][24]. The ChaCha20-Poly1305 combination provides both encryption and authentication in an efficient, integrated construction.

### Key Exchange Mechanisms

**Diffie-Hellman:**

The Diffie-Hellman key exchange algorithm is fundamental to IKE, enabling two parties to establish a shared secret over an insecure channel[19][25][27]. IPsec supports multiple Diffie-Hellman groups with varying key strengths:

\begin{itemize}
\item Group 1 (768-bit): Obsolete and insecure
\item Group 2 (1024-bit): Legacy, increasingly considered insufficient
\item Group 5 (1536-bit): Minimum recommended for current deployments
\item Group 14 (2048-bit): Standard for modern deployments
\item Group 15-18: Higher strengths (3072-bit to 8192-bit)
\item Elliptic Curve groups: Efficient alternatives providing equivalent security with smaller key sizes
\end{itemize}

The Diffie-Hellman exchange is computationally expensive, which is why IKE Phase 1 is designed to establish a long-lived IKE SA that can be reused for multiple Phase 2 negotiations[27].

---

## Packet Processing and Flow

### Outbound Packet Processing

When a host or security gateway sends a packet, IPsec performs the following processing sequence[17][23]:

\begin{enumerate}
\item \textbf{SPD Lookup:} The packet's selectors (source/destination addresses, protocol, ports) are matched against the Security Policy Database to determine the required security treatment
\item \textbf{Action Determination:} Based on SPD entry, the packet is either:
  \begin{itemize}
  \item BYPASS: Sent without IPsec protection
  \item DISCARD: Dropped
  \item PROTECT: IPsec processing required
  \end{itemize}
\item \textbf{SAD Lookup:} If protection is required, find existing SA in Security Association Database matching the policy
\item \textbf{IKE Negotiation:} If no suitable SA exists, trigger IKE to negotiate and establish required SA
\item \textbf{IPsec Processing:} Apply selected protocol (AH or ESP) in chosen mode (transport or tunnel):
  \begin{itemize}
  \item Encrypt payload (if using ESP with encryption)
  \item Compute authentication tag
  \item Add IPsec headers and trailers
  \item For tunnel mode, add new outer IP header
  \end{itemize}
\item \textbf{Transmission:} Send the protected packet to the network
\end{enumerate}

### Inbound Packet Processing

When receiving an IPsec-protected packet, the following sequence occurs[1][17]:

\begin{enumerate}
\item \textbf{Protocol Identification:} Recognize packet as IPsec by protocol number (50 for ESP, 51 for AH)
\item \textbf{SAD Lookup:} Extract SPI and destination address from packet header, look up corresponding SA in Security Association Database[1][20]
\item \textbf{Sequence Number Check:} Verify sequence number for anti-replay protection, reject if duplicate or outside acceptable window
\item \textbf{Authentication Verification:} Compute authentication tag and compare with received value, discard packet if mismatch[8]
\item \textbf{Decryption:} If ESP with encryption, decrypt the payload using the SA's encryption algorithm and key
\item \textbf{Header Processing:} Remove IPsec headers; for tunnel mode, also remove outer IP header revealing original inner packet
\item \textbf{SPD Verification:} Verify the decrypted packet's selectors match the SA's security policy (prevents unauthorized traffic injection)
\item \textbf{Delivery:} Forward packet to upper-layer protocol or routing for further processing
\end{enumerate}

### NAT Traversal Considerations

Network Address Translation (NAT) creates complications for IPsec[2][6]:

**Problems with NAT:**

\begin{itemize}
\item NAT modifies IP addresses and ports in packet headers
\item AH authentication fails because it includes IP header in its integrity check[2][14]
\item ESP can traverse NAT but may encounter issues with embedded IP addresses in payloads
\item IKE traffic uses UDP port 500, which some NAT devices may not handle correctly
\end{itemize}

**NAT Traversal (NAT-T) Solution:**

Modern IPsec implementations include NAT Traversal mechanisms[6]:

\begin{itemize}
\item Detect NAT devices between peers during IKE negotiation
\item Encapsulate ESP packets in UDP (typically UDP port 4500) to ensure NAT compatibility
\item Use keep-alive packets to maintain NAT mappings
\item Handle IP address changes in tunneled packets
\end{itemize}

**GRE over IPsec:**

An alternative approach to NAT issues is using GRE (Generic Routing Encapsulation) tunnels protected by IPsec in transport mode[12]. The GRE tunnel provides the encapsulation, while IPsec protects the GRE packets. This approach can provide additional flexibility in complex routing scenarios.

---

## Implementation Considerations

### Performance Factors

Several factors impact IPsec performance in production deployments:

**Cryptographic Overhead:**

Encryption and authentication operations consume CPU cycles. Hardware acceleration (AES-NI for AES, cryptographic coprocessors) significantly improves throughput[18][29]. Systems without hardware acceleration may achieve better performance with ChaCha20 than software-based AES[18][21].

**MTU and Fragmentation:**

IPsec adds overhead to packets (ESP header, trailer, authentication data, and outer IP header in tunnel mode). This reduces effective MTU, potentially causing fragmentation[6][15]. Proper MTU configuration and Path MTU Discovery help avoid fragmentation and maintain performance.

**Mode Selection:**

Transport mode has lower overhead than tunnel mode due to single IP header[15]. Choose transport mode when both endpoints support IPsec and lower overhead is critical. Tunnel mode is necessary for site-to-site VPNs but increases per-packet overhead[6].

**SA Establishment:**

IKE Phase 1 with Diffie-Hellman key exchange is computationally expensive[27]. Long-lived Phase 1 SAs amortize this cost across many Phase 2 negotiations. Consider increasing SA lifetimes in stable environments to reduce renegotiation frequency.

### Security Best Practices

**Algorithm Selection:**

\begin{itemize}
\item Use AES-256 or ChaCha20 for encryption; avoid 3DES and DES[7][18]
\item Use SHA-256 or stronger for authentication; avoid SHA-1 and MD5[4]
\item Use Diffie-Hellman Group 14 (2048-bit) or stronger[19]
\item Enable Perfect Forward Secrecy (PFS) in Phase 2 for enhanced key security[19]
\end{itemize}

**Key Management:**

\begin{itemize}
\item Use IKE for dynamic key establishment; avoid manual keying except for testing
\item Implement regular key refresh through appropriate SA lifetimes[7]
\item Use strong authentication (certificates preferred over pre-shared keys for scalability)
\item Protect pre-shared keys with strong passphrases if used
\end{itemize}

**Policy Configuration:**

\begin{itemize}
\item Define restrictive SPD policies following least-privilege principle
\item Regularly audit SPD entries to ensure policies match security requirements
\item Use authentication and encryption together (ESP with both enabled)[8]
\item Enable anti-replay protection[4][10]
\end{itemize}

**Operational Security:**

\begin{itemize}
\item Monitor IPsec logs for SA establishment failures and potential attacks
\item Keep IPsec implementations updated with security patches
\item Test failover scenarios to ensure availability
\item Document IPsec configurations for maintenance and troubleshooting
\end{itemize}

### Common Deployment Scenarios

**Site-to-Site VPN:**

Connects two networks through security gateways using IPsec tunnel mode[3][7]. All traffic between networks is transparently encrypted. Hosts on either network do not need IPsec support.

**Remote Access VPN:**

Allows individual users to connect securely to a corporate network[7]. The user's device establishes an IPsec tunnel to a VPN gateway, gaining access to internal resources.

**Host-to-Host:**

Direct IPsec communication between two IPsec-capable hosts using transport mode[3][15]. Provides end-to-end security without intermediary gateways.

**IPsec with Cloud Services:**

Many cloud providers offer IPsec VPN connectivity to virtual networks. This enables hybrid architectures with secure connections between on-premises infrastructure and cloud resources.

---

## Conclusion

IP Security (IPsec) represents a mature, standardized framework for securing IP communications at the network layer. Its comprehensive architecture encompasses multiple protocols (AH, ESP, IKE), operational modes (transport and tunnel), robust key management, and flexible cryptographic algorithm support.

The strength of IPsec lies in its layered approach: the Security Policy Database defines security requirements, Security Associations instantiate those requirements with specific cryptographic parameters, and the Internet Key Exchange protocol automates the complex process of mutual authentication and key establishment. This architecture provides security services—confidentiality, integrity, authentication, and anti-replay protection—transparently to higher-layer protocols and applications.

Modern IPsec implementations leverage hardware-accelerated cryptography (AES-NI) and contemporary algorithms (ChaCha20, SHA-256, strong Diffie-Hellman groups) to provide both robust security and high performance. The protocol's flexibility allows deployment in diverse scenarios from individual host-to-host communications to large-scale site-to-site VPNs protecting thousands of endpoints.

As network security requirements continue to evolve, IPsec remains a foundational technology for building secure communications infrastructure. Understanding its architecture, protocols, and implementation considerations is essential for network security professionals responsible for designing, deploying, and maintaining secure networked systems.

---

## References

[1] IPsec. (2002). *Wikipedia*. https://en.wikipedia.org/wiki/IPsec

[2] IPSEC - Why use Authentication Header (AH) instead of Encapsulated Security Payload? (2014). *Reddit Networking Community*. https://www.reddit.com/r/networking/comments/2peaju/ipsec_why_use_authentication_header_ah_instead_of/

[3] IPsec (Internet Protocol Security) Tunnel and Transport Modes. (2023). *GeeksforGeeks*. https://www.geeksforgeeks.org/computer-networks/ipsec-internet-protocol-security-tunnel-and-transport-modes/

[4] Principles and Practical Applications of IPSec Protocol Technology. (2026). *Oreate AI*. http://oreateai.com/blog/principles-and-practical-applications-of-ipsec-protocol-technology/

[5] *IPSec Part I: AH and ESP*. Florida State University Computer Science Department. https://www.cs.fsu.edu/~duan/classes/cnt5412/lectures/lecture14_ipsec_esp_ah.pdf

[6] Setting Each Mode Up. (2026). *Twingate Blog*. https://www.twingate.com/blog/ipsec-tunnel-mode

[7] IPsec - components, purpose, and how it works. (2023). *SSL2Buy Cybersecurity*. https://www.ssl2buy.com/cybersecurity/ipsec-components-purpose-works

[8] Introduction to IP Security (IPSec). *Cisco Systems*. https://www.cisco.com/c/en/us/td/docs/wireless/asr_5000/21-26/ipsec-reference/

[9] IPsec: Tunnel Mode and Transport Mode. (2025). *Pomerium*. https://www.pomerium.com/glossary/ipsec-tunnel-mode-and-transport-mode

[10] IPSec Architecture. (2019). *GeeksforGeeks*. https://www.geeksforgeeks.org/computer-networks/ipsec-architecture/

[11] AH and ESP protocols. (2024). *IBM Documentation*. https://www.ibm.com/docs/en/zos/3.1.0?topic=ipsec-ah-esp-protocols

[12] Mode: Transport vs Tunnel. GRE w/IPsec. *Reddit Networking Community*. https://www.reddit.com/r/networking/comments/7ijd7c/mode_transport_vs_tunnel_gre_wipsec/

[13] IPSec Architecture Overview with Diagram and Key Components. (2023). *StudoCu*. https://www.studocu.com/in/document/jain-deemed-to-be-university/information-security/

[14] What are AH and ESP in IPsec. (2024). *NetSecCloud*. https://netseccloud.com/ah-vs-esp-understanding-the-core-differences-in-ipsec-protocols

[15] IPSec Transport Mode. (2025). *Palo Alto Networks Documentation*. https://docs.paloaltonetworks.com/pan-os/11-0/pan-os-new-features/networking-features/ipsec-transport-mode

[16] Internet Key Exchange (IKE) in Network Security. (2023). *GeeksforGeeks*. https://www.geeksforgeeks.org/ethical-hacking/internet-key-exchange-ike-in-network-security/

[17] Kent, S., & Seo, K. (2005). *RFC 4301 - Security Architecture for the Internet Protocol*. IETF. https://datatracker.ietf.org/doc/html/rfc4301

[18] AES vs ChaCha20 Encryption: Key Differences, Use Cases. (2026). *DevGlan*. https://www.devglan.com/crypto/aes-vs-chacha20

[19] What is Internet Key Exchange (IKE) and How Does It Work? (2025). *TechTarget SearchSecurity*. https://www.techtarget.com/searchsecurity/definition/Internet-Key-Exchange

[20] Security Association - an overview. *ScienceDirect Topics*. https://www.sciencedirect.com/topics/computer-science/security-association

[21] ChaCha20 v AES256. (2020). *Reddit Crypto Community*. https://www.reddit.com/r/crypto/comments/f7c2nv/chacha20_v_aes256/

[22] What Is an IKE (Internet Key Exchange) Protocol? (2025). *JumpCloud IT Index*. https://jumpcloud.com/it-index/what-is-an-ike-internet-key-exchange-protocol

[23] netdev day 1: IPsec! (2018). *Julia Evans Blog*. https://jvns.ca/blog/2018/07/11/netdev-day-1--ipsec/

[24] AES & ChaCha — A Case for Simplicity in Cryptography. (2025). *Phase Dev Blog*. https://phase.dev/blog/chacha-and-aes-simplicity-in-cryptography

[25] What Is IKE (Internet Key Exchange)? (2025). *Palo Alto Networks Cyberpedia*. https://www.paloaltonetworks.com/cyberpedia/what-is-ike

[26] Configuring IPsec Network Security. *Cisco Systems MDS 9000 Documentation*. https://www.cisco.com/en/US/docs/storage/san_switches/mds9000/sw/rel_3_x/configuration/guides/cli_3_3_1/ipe.pdf

[27] IPsec and IKE. (2024). *Check Point R81 Administration Guide*. https://sc1.checkpoint.com/documents/R81/WebAdminGuides/EN/CP_R81_SitetoSiteVPN_AdminGuide/Topics-VPNSG/IPsec-and-IKE.htm

[28] Introduction to IPsec. *Oracle Solaris Documentation*. https://docs.oracle.com/cd/E19253-01/816-4554/ipsec-ov-2/index.html

[29] AES-256 vs ChaCha20-256 | Popular Encryption Algorithms. (2024). *MojoAuth*. https://mojoauth.com/compare-encryption-algorithms/aes-256-vs-chacha20-256

