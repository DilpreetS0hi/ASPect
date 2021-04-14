using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ASPectLibrary
{
    /// Represents a course offering ie -> Fall 2020, Winter 2021
    public class Offering
    {
        [Key]
        public int OfferingId { get; set; }

        /// <summary>
        /// Winter, Fall, Summer, Spring
        /// </summary>
        public string Semester { get; set; }
        public DateTime Year { get; set; }

        /// <summary>
        /// Id of the STUDENT (application User).
        /// </summary>
        public string Id { get; set; }

        [ForeignKey("Id")]
        public ApplicationUser Instructor { get; set; }
        public int CourseID { get; set; }
        [ForeignKey("CourseID")]
        public Course Course { get; set; }

    }
}

