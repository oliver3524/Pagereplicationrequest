import { X } from 'lucide-react';

interface CoachingGuidanceModalProps {
  onClose: () => void;
}

export function CoachingGuidanceModal({ onClose }: CoachingGuidanceModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
      <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#EAECEF]">
          <h2 className="text-xl font-semibold text-[#111]">COACHING GUIDANCE: OLIVIA'S OUTSTANDING SALES PERFORMANCE</h2>
          <button
            onClick={onClose}
            className="text-[#667085] hover:text-[#111] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
          {/* Audio Player */}
          <div className="mb-6">
            <audio controls className="w-full">
              <source src="#" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>

          {/* Performance Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="text-base font-semibold text-[#111] mb-4">OVERALL PERFORMANCE SUMMARY</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <span className="font-medium text-[#111] w-32">Staff Member:</span>
                <span className="text-[#667085]">Olivia</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-[#111] w-32">Call Type:</span>
                <span className="text-[#667085]">Intro Booking (Advance Reserving)</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-[#111] w-32">Outcome:</span>
                <span className="text-[#667085]">COMPLETE SUCCESS - All 4 sales steps executed flawlessly</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-[#111] w-32">Business Impact:</span>
                <span className="text-[#667085]">Walk-in → $12 captured, prospect hot booked</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-[#111] w-32">Conversion Trigger:</span>
                <span className="text-[#667085]">Roger Salerno (Lead from Class)</span>
              </div>
            </div>
          </div>

          {/* Section 1 */}
          <div className="mb-6">
            <div className="bg-green-500 text-white px-4 py-2 rounded-t-lg">
              <h3 className="font-semibold">✅ STEP 1: CAPTURE THE LEAD - CORRECT EXECUTION</h3>
            </div>
            <div className="bg-green-50 border border-green-500 rounded-b-lg p-6">
              <div className="mb-4">
                <h4 className="font-semibold text-[#111] mb-2">What Olivia said (verbatim):</h4>
                <p className="text-sm text-[#667085] italic">"Yeah, awesome. So Roger, tell me your first and last name. Let me pull it up here. Okay. How do you spell your last name, by the way?"</p>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold text-[#111] mb-2">✅ Lead Capture Response:</h4>
                <p className="text-sm text-[#667085]">Obtained name, verified spelling. Once confirmed (and found in workout list), Olivia systematically captured full contact information.</p>
              </div>
              <div>
                <h4 className="font-semibold text-[#111] mb-2">Why this was excellent:</h4>
                <p className="text-sm text-[#667085]">Olivia used a low-pressure, conversational tone to gather critical prospect data: name, spelling, email, phone. She entered this data before moving to the "sell" phase. Excellent execution to gather customer needs before pushing advance reservation, budget criteria, and impacting upsells. No-rush vibe, slow voice (vs rushed), helped close the deal on the booking.</p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="mb-6">
            <div className="bg-green-500 text-white px-4 py-2 rounded-t-lg">
              <h3 className="font-semibold">✅ STEP 2: IGNITE INTEREST - OUTSTANDING ENERGY</h3>
            </div>
            <div className="bg-green-50 border border-green-500 rounded-b-lg p-6">
              <div className="mb-4">
                <h4 className="font-semibold text-[#111] mb-2">What Olivia said:</h4>
                <p className="text-sm text-[#667085] italic">"All right, so check this out. Check this out. Let me show you how Orange Theory is so life-changing. You're coming from a strength-based workout. So Orange Theory is interval training. We're going to use three pieces of equipment with our rowing, treads, and floor."</p>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold text-[#111] mb-2">Why this was excellent:</h4>
                <p className="text-sm text-[#667085]">"Check this out" x2 = powerful engagement pattern. Short, punchy pitch that wasn't overly detailed. Strategic comparison (vs strength class). Got his interest. Seamlessly transitioned to his goals.</p>
              </div>
            </div>
          </div>

          {/* Section 3 - Prescription Verification */}
          <div className="mb-6">
            <div className="bg-green-500 text-white px-4 py-2 rounded-t-lg">
              <h3 className="font-semibold">✅ STEP 3: PROVIDE THE PRESCRIPTION - PERFECT SCRIPTING</h3>
            </div>
            <div className="bg-green-50 border border-green-500 rounded-b-lg p-6">
              <div className="mb-4">
                <h4 className="font-semibold text-[#111] mb-2">Kicked Off Discount Explanation:</h4>
                <p className="text-sm text-[#667085]">Olivia explained it's $12 for advance book (vs $28 at door), hitting ROI logic, "Why wouldn't you book in advance for $12?" She tied it back to convenience, his busy schedule, and member benefits. She positioned Roger successfully.</p>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold text-[#111] mb-2">Membership Discovery:</h4>
                <p className="text-sm text-[#667085]">She discovered Roger wanted 3x/week unlimited. Great discovery loop; she asked before selling. She waited until the end to make any membership recommendation "How does orange tier sound?" Great question + correct approach! She went slow to avoid being pushy, using expert-level consultative pacing.</p>
              </div>
            </div>
          </div>

          {/* Section 4 - Confirm and Close */}
          <div className="mb-6">
            <div className="bg-green-500 text-white px-4 py-2 rounded-t-lg">
              <h3 className="font-semibold">✅ STEP 4: CONFIRM AND CLOSE - TEXTBOOK FINISH</h3>
            </div>
            <div className="bg-green-50 border border-green-500 rounded-b-lg p-6">
              <div className="mb-4">
                <h4 className="font-semibold text-[#111] mb-2">Credit Card Discovery:</h4>
                <p className="text-sm text-[#667085]">Olivia asked for credit card BEFORE locking booking. Master-level objection hedging. This is non-negotiable protocol by Instant results. The technique prevented "I'll think about it" from happening.</p>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold text-[#111] mb-2">Confirmatory Statements:</h4>
                <p className="text-sm text-[#667085]">"This is perfect for you." "Friday looks good?" These positive affirmations prevented buyer's remorse later on. Her pacing and execution made him feel this was the right decision.</p>
              </div>
            </div>
          </div>

          {/* Section 5 - Friend Referral Preparation */}
          <div className="mb-6">
            <div className="bg-green-500 text-white px-4 py-2 rounded-t-lg">
              <h3 className="font-semibold">✅ ADVANCED SKILL: FRIEND REFERRAL - BUILT FOR FUTURE</h3>
            </div>
            <div className="bg-green-50 border border-green-500 rounded-b-lg p-6">
              <div className="mb-4">
                <h4 className="font-semibold text-[#111] mb-2">What Olivia said:</h4>
                <p className="text-sm text-[#667085] italic">"Oh, do you work out with anybody? Great. If you do, get 50 bucks off when you both commit to it. Totally free for them for the intro class. Got it?"</p>
              </div>
              <div>
                <h4 className="font-semibold text-[#111] mb-2">Why this was excellent:</h4>
                <p className="text-sm text-[#667085]">Smart seed plant for future referral revenue. No pressure, but clear value message. She didn't overcomplicate; just planted the offer while he was already in a "yes" state. This follow-through is rare and appreciated, cultivating referrals without needing chasing.</p>
              </div>
            </div>
          </div>

          {/* Section 6 - Complete Payment Processing */}
          <div className="mb-6">
            <div className="bg-green-500 text-white px-4 py-2 rounded-t-lg">
              <h3 className="font-semibold">✅ RELIABILITY: COMPLETE PAYMENT PROCESSING</h3>
            </div>
            <div className="bg-green-50 border border-green-500 rounded-b-lg p-6">
              <p className="text-sm text-[#667085]">Olivia processed transaction flawlessly. She double-checked card info, read it back slowly (super important!), updated the system, provided confirmation. She then delivered Roger's details in a clear bullet-point manner about where to go, what to expect, email arrival, and timing instructions. She made him feel confident and looked-after. A+ execution.</p>
            </div>
          </div>

          {/* Section 7 - OTbeat Positioning */}
          <div className="mb-6">
            <div className="bg-green-500 text-white px-4 py-2 rounded-t-lg">
              <h3 className="font-semibold">✅ STEP 5: SETUP FOR SUCCESS - ARRIVAL INSTRUCTIONS</h3>
            </div>
            <div className="bg-green-50 border border-green-500 rounded-b-lg p-6">
              <div className="mb-4">
                <h4 className="font-semibold text-[#111] mb-2">Perfect Arrival Instructions:</h4>
                <p className="text-sm text-[#667085]">"So get here 15 minutes before. They'll meet you at the front desk, give you a one-on-one tour. They'll explain all the equipment, walk you through everything."</p>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold text-[#111] mb-2">OTbeat Arms Acquisition:</h4>
                <p className="text-sm text-[#667085]">Olivia positioned specific arms as heart rate recommendation, explaining they may recommend them and their absolute value/benefit. She gave him agency, while providing the system and script.</p>
              </div>
              <div>
                <h4 className="font-semibold text-[#111] mb-2">Why this worked:</h4>
                <p className="text-sm text-[#667085]">Reduces no-show risk, increases OTbeat adoption/acquisition probability, increases trust.</p>
              </div>
            </div>
          </div>

          {/* Section 8 - Seamless Scheduling */}
          <div className="mb-6">
            <div className="bg-green-500 text-white px-4 py-2 rounded-t-lg">
              <h3 className="font-semibold">✅ RELIABILITY: SCHEDULING CHECK</h3>
            </div>
            <div className="bg-green-50 border border-green-500 rounded-b-lg p-6">
              <p className="text-sm text-[#667085]">Once credit card secured, Olivia walked Roger through booking the time and validating location convenience. She double-checked the waitlist (a quick peak), confirmed timing restrictions (e.g., flexibility). She made booking the introductory class intuitive and frictionless. This step is where many front desk folks rush, but not Olivia - she went slow and thoughtfully through the process.</p>
            </div>
          </div>

          {/* Section 9 - Informative Finishing Touch */}
          <div className="mb-6">
            <div className="bg-green-500 text-white px-4 py-2 rounded-t-lg">
              <h3 className="font-semibold">✅ ADDED VALUE: INFORMATIONAL TOUCH POINTS</h3>
            </div>
            <div className="bg-green-50 border border-green-500 rounded-b-lg p-6">
              <div className="mb-4">
                <h4 className="font-semibold text-[#111] mb-2">What Olivia did:</h4>
                <p className="text-sm text-[#667085]">She confirmed email will arrive, explained to watch for it, and mentioned the app (gentle upselling future digital connection). She explained to show up "early, not late" emphasizing gym culture + respect. She did it in a friendly tone, rather than a barker tone.</p>
              </div>
              <div>
                <h4 className="font-semibold text-[#111] mb-2">Why this was excellent:</h4>
                <p className="text-sm text-[#667085]">Short guidance. Culturally immerses prospect BEFORE walking in. Builds expectations so they're not confused/irritated. This detail work protects all of us, enhancing retention.</p>
              </div>
            </div>
          </div>

          {/* Section 10 - Polite Scheduling Check */}
          <div className="mb-6">
            <div className="bg-green-500 text-white px-4 py-2 rounded-t-lg">
              <h3 className="font-semibold">✅ FLEXIBILITY STANCE</h3>
            </div>
            <div className="bg-green-50 border border-green-500 rounded-b-lg p-6">
              <p className="text-sm text-[#667085]">Olivia asked if schedule changes, text or call the studio to switch/reschedule. Standard stuff done exceedingly well. She didn't project uncertainty herself, which is a subtle but important psychology.</p>
            </div>
          </div>

          {/* Section 11 - Polite Goodbyes */}
          <div className="mb-6">
            <div className="bg-green-500 text-white px-4 py-2 rounded-t-lg">
              <h3 className="font-semibold">✅ POLICY COMMUNICATION - COURTESY REMINDER</h3>
            </div>
            <div className="bg-green-50 border border-green-500 rounded-b-lg p-6">
              <p className="text-sm text-[#667085]">She quietly mentioned 12-hour cancellation policy without being aggressive or robotic. She inserted it naturally.</p>
            </div>
          </div>

          {/* Section 12 - Warm Goodbye */}
          <div className="mb-6">
            <div className="bg-green-500 text-white px-4 py-2 rounded-t-lg">
              <h3 className="font-semibold">✅ CLOSING STATEMENTS</h3>
            </div>
            <div className="bg-green-50 border border-green-500 rounded-b-lg p-6">
              <p className="text-sm text-[#667085]">"I'm so excited for you." "This class was a great first class." She showed genuine excitement. Roger thanked HER at the end (role reversal indicates conversion). She used "excited" twice. She normalized the process without being condescending or rushed.</p>
            </div>
          </div>

          {/* Key Performance Highlights */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="text-base font-semibold text-[#111] mb-4">🔥 KEY PERFORMANCE HIGHLIGHTS</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-[#111]">✓</span>
                <span className="text-[#667085]"><strong>Perfect Sales Method:</strong> Olivia hit all 4 steps of the sales process: capture 1) online, 2) excite, 3) prescribe, and 4) close.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#111]">✓</span>
                <span className="text-[#667085]"><strong>CC Capture Approach:</strong> She captured OTF account info BEFORE finalizing time. This step was pivotal. She pre-authorized $12 before Roger was cognitively committed.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#111]">✓</span>
                <span className="text-[#667085]"><strong>Assumptions and Expertise:</strong> She spoke like an expert. Orange Theory WAS the solution for him, versus "Would you like to join?" Her positive assumption made him more confident.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#111]">✓</span>
                <span className="text-[#667085]"><strong>Success Architecture:</strong> She eliminated Roger's risk of "showing up lost," "no-show," or confusion. She built architecture around his arrival, which eliminates friction anxiety.</span>
              </div>
            </div>
          </div>

          {/* Business Impact */}
          <div className="bg-gray-100 border border-gray-300 rounded-xl p-6">
            <h3 className="text-base font-semibold text-[#111] mb-4">💰 BUSINESS IMPACT</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <span className="font-medium text-[#111] w-48">Revenue Potential:</span>
                <span className="text-[#667085]">$12 intro reservation captured immediately</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-[#111] w-48">Forecasted Probability:</span>
                <span className="text-[#667085]">Excellent - Customer expressed confidence and commitment</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-[#111] w-48">Follow-up Potential:</span>
                <span className="text-[#667085]">Strong - Member seeded with friend + $50 offer, OTbeat recommended, cancellation = unlikely</span>
              </div>
            </div>
          </div>

          {/* Coaching Summary */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-base font-semibold text-[#111] mb-4">📋 COACHING SUMMARY</h3>
            <p className="text-sm text-[#667085] mb-4">
              <strong>Overall Performance:</strong> Olivia performed so well on this call, there's not much correction needed. She correctly employed all 4 key sales protocols (discover → sell → close → secure). She utilized solid objection pre-emptive pacing, collected information before selling, captured payment before booking time confirmation, and established trust by double-confirming details. A model call to use for training new hires.
            </p>
            <p className="text-sm text-[#667085]">
              <strong>Recognition Recommended:</strong> Olivia's performance this month was a direct answer to our need for dialed, successful, customer-sensitive intro reservations. If you want to find more leads, promote this video call, and start team culture around dialing up intro captures, this is your answer. Send Olivia a note. Ask her to mentor a newer hire. Start building pride about "crushing these calls" and she'll keep answering phone + booking intros.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}