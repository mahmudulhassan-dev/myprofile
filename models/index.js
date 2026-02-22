import sequelize from '../config/db.js';
import { User, UserRole, UserLog } from './User.js';
import { Role, Permission, RolePermission, Subscriber, NewsletterGroup, NewsletterCampaign, NewsletterTemplate, NewsletterLog } from './Security.js';
import { Profile, ProfileSocial, ProfileExperience, ProfileEducation, ProfileAward } from './Profile.js';
import Project from './Project.js';
import { BlogPost, Category, Tag, Comment } from './Blog.js';
import { Product, ProductVariation, Attribute, ProductReview, ProductMeta } from './Product.js';
import { Order, Booking, Service } from './Commerce.js';
import { ChatSession, ChatMessage, ChatSettings, KnowledgeDoc } from './chatModels.js';
import { PixelConfig, PixelEvent, CustomScript, PixelLog } from './pixelModels.js';
import { Currency, CurrencyLog, CurrencySetting } from './currencyModels.js';
import { Folder, File } from './fileModels.js';
import { Setting, Page, FAQ, Appearance, Widget, MenuItem, FooterSection, Contact, ContactNote, ActivityLog, SystemMetric, Skill, AutomationWorkflow, AutomationTrigger, AutomationAction, AutomationLog } from './System.js';

// --- Relationships ---

// User & Role
User.belongsToMany(Role, { through: UserRole });
Role.belongsToMany(User, { through: UserRole });
User.hasMany(UserLog);
UserLog.belongsTo(User);

// Role & Permission
Role.belongsToMany(Permission, { through: RolePermission });
Permission.belongsToMany(Role, { through: RolePermission });

// Profile
Profile.hasMany(ProfileSocial);
ProfileSocial.belongsTo(Profile);
Profile.hasMany(ProfileExperience);
ProfileExperience.belongsTo(Profile);
Profile.hasMany(ProfileEducation);
ProfileEducation.belongsTo(Profile);
Profile.hasMany(ProfileAward);
ProfileAward.belongsTo(Profile);

// Project
Project.belongsTo(User, { as: 'client', foreignKey: 'userId' });
User.hasMany(Project, { foreignKey: 'userId' });

// Blog
BlogPost.belongsTo(Category);
Category.hasMany(BlogPost);
BlogPost.belongsToMany(Tag, { through: 'PostTags' });
Tag.belongsToMany(BlogPost, { through: 'PostTags' });
BlogPost.hasMany(Comment);
Comment.belongsTo(BlogPost);
Comment.belongsTo(User);
User.hasMany(Comment);
Category.hasMany(Category, { as: 'children', foreignKey: 'parentId' });
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parentId' });

// Product
Product.belongsTo(Category);
Category.hasMany(Product);
Product.belongsToMany(Tag, { through: 'ProductTags' });
Tag.belongsToMany(Product, { through: 'ProductTags' });
Product.hasMany(ProductVariation, { as: 'variations', foreignKey: 'productId', onDelete: 'CASCADE' });
ProductVariation.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(ProductReview, { as: 'reviews', foreignKey: 'productId' });
ProductReview.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(ProductMeta, { as: 'meta', foreignKey: 'productId', onDelete: 'CASCADE' });
ProductMeta.belongsTo(Product, { foreignKey: 'productId' });

// Commerce
Order.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(Order, { foreignKey: 'productId' });

Booking.belongsTo(Service);
Service.hasMany(Booking);
Booking.belongsTo(User, { as: 'client', foreignKey: 'userId' });
User.hasMany(Booking, { foreignKey: 'userId' });

// System
MenuItem.hasMany(MenuItem, { as: 'subItems', foreignKey: 'parentId' });
MenuItem.belongsTo(MenuItem, { as: 'parent', foreignKey: 'parentId' });

// Chat
ChatSession.hasMany(ChatMessage, { foreignKey: 'session_id', onDelete: 'CASCADE' });
ChatMessage.belongsTo(ChatSession, { foreignKey: 'session_id' });
ChatSession.belongsTo(User, { foreignKey: 'agent_id', as: 'Agent' });

// Contact Relations
Contact.hasMany(ContactNote);
ContactNote.belongsTo(Contact);
ContactNote.belongsTo(User);

export {
    sequelize,
    User, UserRole, UserLog,
    Role, Permission, RolePermission, Subscriber, NewsletterGroup, NewsletterCampaign, NewsletterTemplate, NewsletterLog,
    Profile, ProfileSocial, ProfileExperience, ProfileEducation, ProfileAward,
    Project,
    BlogPost, Category, Tag, Comment,
    Product, ProductVariation, Attribute, ProductReview, ProductMeta,
    Order, Booking, Service,
    ChatSession, ChatMessage, ChatSettings, KnowledgeDoc,
    PixelConfig, PixelEvent, CustomScript, PixelLog,
    Currency, CurrencyLog, CurrencySetting,
    Folder, File,
    Setting, Page, FAQ, Appearance, Widget, MenuItem, FooterSection,
    Contact, ContactNote, ActivityLog, SystemMetric, Skill,
    AutomationWorkflow, AutomationTrigger, AutomationAction, AutomationLog
};
