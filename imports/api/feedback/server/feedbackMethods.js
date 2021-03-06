import SimpleSchema from "simpl-schema";
import nodemailer from "nodemailer";
import { Feedback } from "../feedback";

let mailTransporter, mailConfig;
if (Meteor.settings.email && Meteor.settings.email.mail) {
  mailConfig = Meteor.settings.email.mail;
  mailTransporter = nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    secure: mailConfig.secure,
    auth: {
      user: mailConfig.username,
      pass: mailConfig.password
    }
  });
}

export const updateStatus = new ValidatedMethod({
  name: "feedback.updateStatus",
  validate: new SimpleSchema({
    id: {
      type: String
    },
    status: {
      type: String
    }
  }).validator(),
  run({ id, status }) {
    logger.debug("feed.updateStatus called", { id, status });

    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error(401, "You need to login");
    }

    if (!Roles.userIsInRole(userId, ["admin"])) {
      throw new Meteor.Error(403, "Access denied");
    }

    return Feedback.update(id, { $set: { status } });
  }
});

export const sendFeedback = new ValidatedMethod({
  name: "feedback.new",
  validate: new SimpleSchema({
    category: {
      type: String
    },
    name: {
      type: String
    },
    email: {
      type: String
    },
    subject: {
      type: String
    },
    message: {
      type: String
    },
    context: {
      type: Object,
      optional: true
    },
    "context.os": {
      type: String
    },
    "context.browser": {
      type: String
    },
    "context.version": {
      type: String
    },
    "context.url": {
      type: String
    }
  }).validator(),
  run({ category, name, email, subject, message, context }) {
    this.unblock();
    logger.debug("feedback.new called", { category, name });

    let doc = {
      category,
      name,
      email,
      subject,
      message
    };

    const userId = Meteor.userId();

    if (userId) doc["userId"] = userId;
    if (context) doc["context"] = context;

    const id = Feedback.insert(doc);

    if (mailTransporter) {
      const url = Meteor.absoluteUrl("/admin/tickets?id=" + id);
      mailTransporter
        .sendMail({
          from: `"Liane" <${mailConfig.username}>`,
          to: `${Meteor.settings.email.admins.join(", ")}`,
          subject: `[TICKET] ${category.toUpperCase()} from ${name}`,
          html: `
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br/>${message}</p>
        <hr/>
        <p>Manage this ticket: <a href="${url}">${url}</a></p>
        `
        })
        .catch(err => {
          logger.debug("error sending email", err);
        });
    }
  }
});

export const queryCount = new ValidatedMethod({
  name: "feedback.queryCount",
  validate: new SimpleSchema({
    query: {
      type: Object,
      blackbox: true,
      optional: true
    }
  }).validator(),
  run({ query }) {
    return Feedback.find(query || {}).count();
  }
});
