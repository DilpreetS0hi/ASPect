using System;
using System.Collections.Generic;
using ASPectLibrary;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Web.Models;

namespace Web.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        protected override void OnModelCreating (ModelBuilder builder) {
            base.OnModelCreating(builder);
            //Scott added for m <> m relation
            builder.Entity<Membership>().HasKey(mb => new { mb.Id, mb.ProjectId });

            builder.Entity<Membership>()
            .HasOne<ApplicationUser>(mb => mb.Student)
            .WithMany(au => au.Memberships)
            .HasForeignKey(mb => mb.Id);

            builder.Entity<Membership>()
            .HasOne<Project>(mb => mb.Project)
            .WithMany(p => p.Memberships)
            .HasForeignKey(mb => mb.ProjectId);

            //builder.Entity<Enrollment>().HasKey(er => new { er.OfferingId, er.Id , er.EnrollmentId});

            PasswordHasher<ApplicationUser> ph = new PasswordHasher<ApplicationUser>();
            string PASSWORD = "P@$$w0rd";

            /* ----------------- Roles ----------------- */
            string adminRoleId = Guid.NewGuid().ToString();
            var adminRole = new ApplicationRole()
            {
                
                Name = Constants.ASPectRoles.Admin.RoleName,
                NormalizedName = Constants.ASPectRoles.Admin.RoleName,
                Description = Constants.ASPectRoles.Admin.RoleDesc,
                Id = adminRoleId,
                ConcurrencyStamp = adminRoleId,
                CreatedDate = DateTime.Now,
            };

            string instructorRoleId = Guid.NewGuid().ToString();
            var instructorRole = new ApplicationRole()
            {
                Name = Constants.ASPectRoles.Instructor.RoleName,
                NormalizedName = Constants.ASPectRoles.Instructor.RoleName,
                Description = Constants.ASPectRoles.Instructor.RoleDesc,
                Id = instructorRoleId,
                ConcurrencyStamp = instructorRoleId,
                CreatedDate = DateTime.Now,
            };
    
            string studentRoleId = Guid.NewGuid().ToString();
            var studentRole = new ApplicationRole()
            {
                Name = Constants.ASPectRoles.Student.RoleName,
                NormalizedName = Constants.ASPectRoles.Student.RoleName,
                Description = Constants.ASPectRoles.Student.RoleDesc,
                Id = studentRoleId,
                ConcurrencyStamp = studentRoleId,
                CreatedDate = DateTime.Now,
            };
 
            //seed admin role
            builder.Entity<ApplicationRole>().HasData(
                adminRole,
                instructorRole,
                studentRole
            );
 
            /* ----------------- Add Admin User ----------------- */
            string adminUserId = "5bb3f1ca-d27c-4655-b8d6-6c2b3016f2d3";
            //create adminUser
            var adminUser = new ApplicationUser
            {
                Id = adminUserId,
                Email = "admin@aspect.com",
                NormalizedEmail = "ADMIN@ASPECT.COM",
                EmailConfirmed = true,
                FirstName = "Adam",
                LastName = "Aldridge",
                UserName = "admin@aspect.com",
                NormalizedUserName = "ADMIN@ASPECT.COM"
            };
            //set adminUser password
            adminUser.PasswordHash = ph.HashPassword(adminUser, PASSWORD);

            /* ----------------- Add Teacher User ----------------- */
            string instructorUserId = "9216a976-f1ba-4d73-aff6-f818b4b5c6a7";
            //create memberUser
            var teacherUser = new ApplicationUser
            {
                Id = instructorUserId,
                Email = "instructor@aspect.com",
                NormalizedEmail = "INSTRUCTOR@ASPECT.COM",
                EmailConfirmed = true,
                FirstName = "Ted",
                LastName = "Smith",
                UserName = "instructor@aspect.com",
                NormalizedUserName = "INSTRUCTOR@ASPECT.COM"
            };
            //set memberUser password
            teacherUser.PasswordHash = ph.HashPassword(teacherUser, PASSWORD);
            /* ----------------- Add Student User ----------------- */
            string studentUserId = "363624a6-0978-4866-b5ee-b135a6fc3870";
            //create memberUser
            var memberUser = new ApplicationUser
            {
                Id = studentUserId,
                Email = "student@aspect.com",
                NormalizedEmail = "STUDENT@ASPECT.COM",
                EmailConfirmed = true,
                FirstName = "Mike",
                LastName = "Myers",
                UserName = "student@aspect.com",
                NormalizedUserName = "STUDENT@ASPECT.COM",
            };
            //set memberUser password
            memberUser.PasswordHash = ph.HashPassword(memberUser, PASSWORD);

            /* ----------------- Add Student User ----------------- */
            string studentUserId2 = "363624a6-1111-4866-b5ee-b135a6fc3870";
            //create memberUser
            var memberUser2 = new ApplicationUser
            {
                Id = studentUserId2,
                Email = "student2@aspect.com",
                NormalizedEmail = "STUDENT2@ASPECT.COM",
                EmailConfirmed = true,
                FirstName = "Mike2",
                LastName = "Myers2",
                UserName = "student2@aspect.com",
                NormalizedUserName = "STUDENT2@ASPECT.COM"
            };
            //set memberUser password
            memberUser2.PasswordHash = ph.HashPassword(memberUser, PASSWORD);

            //seed users
            builder.Entity<ApplicationUser>().HasData(adminUser, teacherUser, memberUser, memberUser2);

            /* ----------------- Add UserRoles ----------------- */
            builder.Entity<IdentityUserRole<string>>().HasData(
                new IdentityUserRole<string>()
                {
                    RoleId = adminRoleId,
                    UserId = adminUserId
                },
                new IdentityUserRole<string>()
                {
                    RoleId = instructorRoleId,
                    UserId = instructorUserId
                },
                new IdentityUserRole<string>()
                {
                    RoleId = studentRoleId,
                    UserId = studentUserId
                },
                new IdentityUserRole<string>() {
                    RoleId = studentRoleId,
                    UserId = studentUserId2
                }
            );

            builder.Entity<Project>().ToTable ("Project");
            builder.Entity<Membership>().HasOne(p => p.Project);
            //Defines a COMPOSITE KEY for Membership
            builder.Entity<Membership>()
                    .HasKey(c => new { c.Id, c.ProjectId });

            builder.Seed();
        }

        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectCategory> ProjectCategory { get; set; }
        public DbSet<ProgressUpdate> ProgressUpdates { get; set; }
        public DbSet<Course> Course { get; set; }
        public DbSet<Membership> Memberships { get; set; }
        public DbSet<ProjectRole> ProjectRoles { get; set; }
        public DbSet<PeerEvaluation> PeerEvaluations { get; set; }
        public DbSet<ProjectRequirement> ProjectRequirements { get; set; }
        public DbSet<Assignment> Assignments { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<Offering> Offerings { get; set; }
    }
}
