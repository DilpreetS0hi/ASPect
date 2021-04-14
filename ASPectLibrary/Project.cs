using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ASPectLibrary
{
    public class Project
    {
        [Key]
        public int ProjectId { get; set; }
        public string  TeamName { get; set; }
        public int ProjectCategoryId { get; set; }

        [ForeignKey("ProjectCategoryId")]
        public ProjectCategory ProjectCategory { get; set; }
        public string AppName { get; set; }
        public string Description { get; set; }
        public string AspNetUserId { get; set; }
        public int CourseId { get; set; }

        [ForeignKey("CourseId")]
        public Course Course{ get; set; }

        public IList<Membership> Memberships { get; set; }
    }
}