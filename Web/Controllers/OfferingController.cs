using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ASPectLibrary;
using Web.Data;

namespace Web.Controllers
{
    /**
        A Controller with basic CRUD operations for the Offering Model.
        Can be accessed at baseUrl/api/Offering
    */
    [Route("api/[controller]")]
    [ApiController]
    public class OfferingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OfferingController(ApplicationDbContext context)
        {
            _context = context;
        }


        /// GET
        /// Summary: Returns all Offerings in the System
        /// Produces: 
        ///     application/json
        /// Responses: 
        ///     200 : Success
        ///     404 : NoContent if there are no results
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Offering>>> GetOfferings()
        {
            var results = await _context.Offerings
                                        .Include(o => o.Instructor)
                                        .Include(o => o.Course)
                                        .Select(p => new {
                                            Course = p.Course,
                                            Instructor = p.Instructor.Id,
                                            Semester = p.Semester,
                                            Year = p.Year,
                                            OfferingId = p.OfferingId
                                        })
                                        .ToListAsync();

            if (results.Count > 0) {
                return Ok(results);
            } else {
                return NotFound();
            }
        }

        /// GET
        /// Summary: Returns all Offerings matching an id
        /// Produces: 
        ///     application/json
        /// Parameters: 
        ///    id
        ///     in: path
        ///     description: The Id of the Offering
        ///     required: True
        ///     type: Integer
        /// Responses: 
        ///     200 : Success
        ///     404 : NotFound, If there is no offerings.
        [HttpGet("{id}")]
        public async Task<ActionResult<Offering>> GetOffering(int id)
        {
            var offering = await _context.Offerings.FindAsync(id);

            if (offering == null)
            {
                return NotFound();
            }

            return offering;
        }



        /// PUT
        /// Summary: Edits an Offering matching an id
        /// Produces: 
        ///     application/json
        /// Parameters: 
        ///    id
        ///     in: path
        ///     description: The id of the offering to edit
        ///     required: True
        ///     type: Integer
        ///    offering
        ///     in: path
        ///     description: The edited offering 
        ///     required: True
        ///     type: Offering
        /// Responses: 
        ///     200 : Success
        ///     400 : BadRequest, If id does not match the Offering Id 
        ///     404 : NotFound, If there is no Offering.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOffering(int id, Offering offering)
        {
            if (id != offering.OfferingId)
            {
                return BadRequest();
            }

            _context.Entry(offering).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OfferingExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        /// POST
        /// Summary: Creates an offering 
        /// Produces: 
        ///     application/json
        /// Parameters: 
        ///    offering
        ///     in: body
        ///     description: The Offering to create
        ///     required: True
        ///     type: Offering
        /// Responses: 
        ///     200 : Success
        [HttpPost]
        public async Task<ActionResult<Offering>> PostOffering(Offering offering)
        {
            _context.Offerings.Add(offering);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOffering", new { id = offering.OfferingId }, offering);
        }

       
        /// PUT
        /// Summary: Deletes an offering matching an id
        /// Produces: 
        ///     application/json
        /// Parameters: 
        ///    id
        ///     in: path
        ///     description: The id of the offering to delete
        ///     required: True
        ///     type: Integer
        /// Responses: 
        ///     204 : NoContent, If the offering is removed
        ///     404 : NotFound, If there is not offering to delete.
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOffering(int id)
        {
            var offering = await _context.Offerings.FindAsync(id);
            if (offering == null)
            {
                return NotFound();
            }

            _context.Offerings.Remove(offering);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        //Helper functions used to see if an offering exists 
        //Parameters: The id of the offering as an Integer
        private bool OfferingExists(int id)
        {
            return _context.Offerings.Any(e => e.OfferingId == id);
        }
    }
}
