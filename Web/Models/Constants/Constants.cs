namespace Web.Models
{
    public class Constants
    {
        public partial class ASPectRoles
        {
            public partial class Admin {
                public const string RoleName = "Administrator";
                public const string RoleDesc = "This is the administrator role.";
                public const string UserName = "admin@aspect.com";
                public const string Email = "admin@aspect.com";
            }

            public partial class Instructor {
                public const string RoleName = "Instructor";
                public const string RoleDesc = "This is the instructor role.";
                public const string UserName = "instructor@aspect.com";
                public const string Email = "instructor@aspect.com";
            }
            
            public partial class Student {
                public const string RoleName = "Student";
                public const string RoleDesc = "This is the student role.";
                public const string UserName = "student@aspect.com";
                public const string Email = "student@aspect.com";
            }
        }
    }
}