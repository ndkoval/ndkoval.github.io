---
title:  "4-Day Workshop on Concurrent Programming Fundamentals"
layout: single
classes: wide
permalink: /workshop/
author_profile: true
comments: true
toc: false
toc_label: Workshop
---

With over seven years of research and teaching experience in concurrent programming, 
I've designed this workshop to transform how your team approaches concurrency challenges. 
The course focuses on practical algorithms and techniques that can be immediately applied to your company's projects. 
Your developers will learn and implement a wide range of classic and modern concurrent data structures, 
master testing and debugging techniques, and elevate their expertise to new heights.

<div style="text-align: center; margin: 30px 0;">
  <a href="#pricing-and-booking" class="btn btn--primary" style="display: inline-block; padding: 12px 30px; font-weight: bold; font-size: 1.1rem; border-radius: 30px; box-shadow: 0 5px 15px rgba(0,102,204,0.3); transition: all 0.3s ease;">Pricing and Booking</a>
</div>

## Workshop Format

The workshop spans 4 days and is designed for 8 hours of focused work per day:

- **09:00 – 12:30**: Guided workshop with hands-on coding (we will use Java or Kotlin)
- **12:30 – 13:30**: Lunch break
- **13:30 – 18:00**: Practical implementation with instructor support

## Workshop Curriculum

*Curriculum is customizable based on participants' experience and specific interests.*

### Day 1: Foundations and Fundamentals
We begin with essential locking strategies and progress to classic non-blocking data structures like Treiber stack and Michael-Scott queue. Your team will also learn effective testing approaches for concurrent algorithms on JVM.

### Day 2: Advanced Queue Implementations
Your developers will implement a Fetch-and-Add-based queue and tackle the challenge of removing elements from the middle, scaling up both performance and their understanding of complex concurrency patterns.

### Day 3: Powerful Concurrency Patterns
These two powerful concepts—flat combining and descriptors—allow your team to build concurrent versions of any sequential algorithm and perform atomic updates across multiple memory locations.

### Day 4: Practical Applications and Testing
We conclude with the design and implementation of a concurrent hash table using open addressing,
and master writing tests for concurrent code on JVM — ensuring your team can verify the correctness of their implementations.

## Pricing & Booking {#pricing-and-booking}

<div style="display: flex; justify-content: center; margin: 30px 0;">
  <div style="background: #fff; padding: 25px; border-radius: 8px; box-shadow: 0 3px 10px rgba(0,0,0,0.1); border-top: 5px solid #0066cc; max-width: 500px; width: 100%;">
    <h3 style="color: #0066cc; margin-top: 0; text-align: center;">Corporate Workshop Package</h3>
    <div style="font-size: 2em; text-align: center; margin: 15px 0; font-weight: bold;">12,000 EUR</div>
    <p style="text-align: center; color: #666; margin-bottom: 20px;">for 10 participants</p>
    <p style="text-align: center; color: #666; margin-bottom: 20px;">Each additional participant: 500 EUR <br>(up to 30 participants)</p>
    <p style="text-align: center; color: #666; margin-bottom: 20px;">+ Travel costs</p>
    <ul style="padding-left: 20px; margin-bottom: 25px;">
      <li>4-day intensive workshop</li>
      <li>Comprehensive course materials</li>
      <li>Hands-on exercises with instructor support</li>
      <li>Certificate of completion</li>
    </ul>
    <p style="text-align: center; margin-top: 20px;">
      <a href="mailto:parusnikita@gmail.com?subject=4-Day%20Workshop%20on%20Concurrent%20Programming%20Fundamentals" class="btn btn--primary" style="width: 100%; text-align: center; display: block; padding: 10px 0;">Request Booking</a>
    </p>
  </div>
</div>


## What Past Participants Say

<div class="testimonial-grid">

  <div class="testimonial">
    <div class="testimonial-content">
      <img src="/assets/images/tagir_valeev.png" alt="Tagir Valeev" class="testimonial-image">
      <div>
        <h3>Tagir Valeev</h3>
        <p class="testimonial-role">Technical Lead, JetBrains</p>
      </div>
    </div>
    <p class="testimonial-text">The course covers concurrent data structures in depth, from atomic counters to full-fledged concurrent hashmaps. Nikita explains the material clearly and with expertise. The practical assignments are challenging but manageable, and with Lincheck, you can quickly spot missed corner cases in your code and keep moving forward.</p>
  </div>

  <div class="testimonial">
    <div class="testimonial-content">
      <img src="/assets/images/valentina_kiryushkina.jpeg" alt="Valentina Kiryushkina" class="testimonial-image">
      <div>
        <h3>Valentina Kiryushkina</h3>
        <p class="testimonial-role">Team Lead, JetBrains</p>
      </div>
    </div>
    <p class="testimonial-text">The workshop paired clear theory with engaging, hands-on tasks that doubled as cross-team building. My only regret is that it ended so quickly!</p>
  </div>

</div>

<style>
.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.testimonial {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1.25rem 1.75rem 1.5rem 1.75rem;
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid rgba(0,102,204,0.1);
  overflow: hidden;
}

.testimonial::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #0066cc, #4d94ff);
}

.testimonial:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}


.testimonial-image {
  width: 85px;
  height: 85px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1.25rem;
  border: 3px solid #fff;
  box-shadow: 0 4px 10px rgba(0,0,0,0.12);
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.testimonial:hover .testimonial-image {
  transform: scale(1.05);
}

.testimonial-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.testimonial-content h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #0066cc;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.testimonial-role {
  color: #555;
  font-style: italic;
  margin: 0.3rem 0 0;
  font-size: 0.95rem;
  opacity: 0.9;
}

.testimonial-text {
  font-size: 1rem;
  line-height: 1.5;
  position: relative;
  font-style: italic;
  color: #000;
  margin-top: 1rem;
  width: 100%;
  padding: 1rem 1.5rem 1rem 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.08);
}

.testimonial-text::before {
  content: """;
  position: absolute;
  top: -0.5rem;
  left: 0.5rem;
  font-size: 3rem;
  color: #0066cc;
  opacity: 0.3;
  font-family: Georgia, serif;
  line-height: 1;
}

.testimonial-text::after {
  content: """;
  position: absolute;
  bottom: -1.5rem;
  right: 0.5rem;
  font-size: 3rem;
  color: #0066cc;
  opacity: 0.3;
  font-family: Georgia, serif;
  line-height: 1;
}


@media (max-width: 768px) {
  .testimonial-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .testimonial {
    padding: 1.5rem 1.5rem 1.75rem 1.5rem;
  }

  .testimonial-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .testimonial-content > div {
    text-align: center;
  }

  .testimonial-image {
    margin-right: 0;
    margin-bottom: 1rem;
    width: 90px;
    height: 90px;
  }

  .testimonial-text {
    text-align: left;
  }
}
</style>

## FAQ

### Q: What will I get as a participant?

* *Practical Skills & Intuition.* Turn theory into practical skills and intuition with hands-on labs.
* *Real-World Bug Analysis.* Analyze real bugs and get to know what can go wrong in the world of concurrency.
* *Team Building.* Meet your colleagues from other teams and bond with them by solving problems together.

### Q: Will this course be useful for my daily work?
Concurrency is a common concept,
and understanding its basic principles is crucial even if you don't write concurrent code.
Instead of focusing on constantly changing frameworks and libraries,
we'll dive into the most fundamental and practical algorithms and techniques,
building a lasting skillset and intuition.

### Q: As a skilled developer, do I need this introductory course?
Absolutely!
If you are unfamiliar with concurrent algorithms,
the course will equip you with valuable skills and knowledge.


<div style="background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%); padding: 35px; border-radius: 12px; margin: 40px 0; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid rgba(0,102,204,0.1); position: relative; overflow: hidden;">
  <div style="position: absolute; top: 0; left: 0; width: 100%; height: 5px; background: linear-gradient(90deg, #0066cc, #4d94ff);"></div>
  <h3 style="margin-top: 0; color: #0066cc; font-size: 1.5rem; margin-bottom: 15px;">Have Questions?</h3>
  <p style="color: #555; font-size: 1.1rem; max-width: 600px; margin: 0 auto 20px; line-height: 1.6;">Let's connect and explore how this workshop can benefit your team.</p>
  <a href="mailto:parusnikita@gmail.com?subject=Workshop%20Questions%20and%20Topics" class="btn btn--primary" style="display: inline-block; padding: 12px 30px; font-weight: bold; font-size: 1.1rem; border-radius: 30px; box-shadow: 0 5px 15px rgba(0,102,204,0.3); transition: all 0.3s ease;">Contact Me</a>
</div>
