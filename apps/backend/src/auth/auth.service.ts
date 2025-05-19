import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankIdSession } from './entities/bankid-session.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable() // Marks this class as a provider that can be injected into constructors
export class AuthService {
  constructor(
    // Injects the TypeORM repository for the BankIdSession entity
    @InjectRepository(BankIdSession)
    private sessionsRepo: Repository<BankIdSession>,
  ) {}

  /**
   * Starts a new BankID session:
   * 1. Generates a unique order reference (UUID).
   * 2. Constructs an autostart URL for the BankID app, including:
   *    - autostarttoken: the generated orderRef
   *    - redirect: where the BankID app should return after completion
   * 3. Encodes that URL into a QR code image URL via a public API.
   * 4. Persists a new session record in the database with status “pending”.
   *
   * @param personalNumber - The Swedish personal number (YYYYMMDDNNNN) to authenticate
   * @returns The orderRef (token) and a URL to the generated QR code image
   */
  async initiate(personalNumber: string) {
    // Create a unique identifier for this authentication request
    const orderRef = uuidv4();

    // Determine the frontend callback URL (falling back to localhost)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    // Build the deep link that the BankID app will consume
    const autostartUrl = `bankid:///?autostarttoken=${orderRef}&redirect=${encodeURIComponent(
      frontendUrl + '/callback'
    )}`;

    // URL-encode the deep link for embedding in the QR code
    const qrData = encodeURIComponent(autostartUrl);

    // Use a public QR code generation service to create a 300×300 PNG
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrData}`;

    // Calculate expiration timestamp: now + 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Build a new BankIdSession entity in “pending” state
    const session = this.sessionsRepo.create({
      orderRef,
      personalNumber,
      qrCode,
      status: 'pending',     // Initial status
      expiresAt,             // When this session times out
    });

    // Save the session record to the database
    await this.sessionsRepo.save(session);

    // Return the token and QR code URL for the frontend to display
    return { orderRef, qrCodeUrl: qrCode };
  }

  /**
   * Checks the current status of an existing session:
   * 1. Looks up the session by orderRef.
   * 2. Computes how much time has elapsed since initiation.
   * 3. Updates status based on thresholds:
   *    - >20s elapsed: mark as “complete”
   *    - >10s elapsed: mark as “userSign” with a hint code
   * 4. Persists any status change.
   *
   * @param orderRef - The UUID token identifying the session
   * @returns The current status and an optional hint code
   * @throws NotFoundException if no session exists with the given token
   */
  async status(orderRef: string) {
    // Retrieve the session record, or throw 404 if not found
    const session = await this.sessionsRepo.findOne({ where: { orderRef } });
    if (!session) throw new NotFoundException(`Session ${orderRef} not found`);

    let hintCode: string | null = null;

    // Calculate how much time has passed since the session was created:
    // we stored expiresAt = start + 5min, so start = expiresAt - 5min
    const sessionStart = session.expiresAt.getTime() - 5 * 60 * 1000;
    const elapsed = Date.now() - sessionStart;

    // Update the session status according to elapsed time thresholds
    if (elapsed > 20_000) {
      // After 20 seconds, consider the auth flow “complete”
      session.status = 'complete';
    } else if (elapsed > 10_000) {
      // Between 10s and 20s, indicate that the user should sign
      session.status = 'userSign';
      hintCode = 'SKICKA'; // Example Swedish hint
    }
    // Otherwise, leave status as pending

    // Save any changes back to the database
    await this.sessionsRepo.save(session);

    // Return the status and hint (if applicable)
    return { status: session.status, hintCode };
  }

  /**
   * Cancels an ongoing session:
   * 1. Looks up the session by orderRef.
   * 2. Removes it from the database.
   *
   * @param orderRef - The UUID token identifying the session
   * @returns A simple acknowledgement of cancellation
   * @throws NotFoundException if the session does not exist
   */
  async cancel(orderRef: string) {
    // Find the session or throw 404
    const session = await this.sessionsRepo.findOne({ where: { orderRef } });
    if (!session) throw new NotFoundException(`Session ${orderRef} not found`);

    // Delete the session record, effectively cancelling it
    await this.sessionsRepo.remove(session);

    // Return a boolean flag to the caller
    return { cancelled: true };
  }
}
