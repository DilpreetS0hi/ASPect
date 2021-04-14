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
         A Controller with basic CRUD operations for the PeerEvaluations Model.
         Can be accessed at baseUrl/api/PeerEvaluation
     */
     [Route("api/[controller]")]
     [ApiController]
     public class PeerEvaluationController : ControllerBase
     {
         private readonly ApplicationDbContext _context;

         public PeerEvaluationController(ApplicationDbContext context)
         {
             _context = context;
         }


         /// GET
         /// Summary: Finds all instances of PeerEvaluation where peerEvaluaterId and peerBeingEvaluatedId
         ///          are involve. 
         /// Description: One, both, or neither of the ids can be used in the query. Will return a list if
         ///              none are specified.
         /// Produces: 
         ///     application/json
         /// Parameters: 
         ///    peerEvaluaterId
         ///     in: body
         ///     description: The id of the student doing the evaluation
         ///     required: false
         ///     type: String
         ///    peerBeingEvaluatedId
         ///     in: body
         ///     description: The id of the student being evaluated
         ///     required: false
         ///     type: String
         /// Responses: 
         ///     200 : Success
         ///     400 : BadRequest if there are no results
         [HttpGet]
         public async Task<ActionResult<IEnumerable<PeerEvaluation>>> GetPeerEvaluationsByStudents(
                                [FromQuery] string peerEvaluaterId, [FromQuery]string peerBeingEvaluatedId)
         {
            System.Collections.Generic.List<ASPectLibrary.PeerEvaluation> result = null;

            //If both studentIds are empty return ALL evaluations
            if (peerEvaluaterId == null && peerBeingEvaluatedId == null) {
                return await _context.PeerEvaluations.Include(i=>i.UserBeingEvaluated).Include(i=>i.UserEvaluating).Include(i=>i.Project).ThenInclude(i=>i.Course).ToListAsync();
            }

            //Returns all instances of PeerEvaluations with these two ids if both are included 
            if (peerEvaluaterId != null && peerBeingEvaluatedId != null) {
                return result = await _context.PeerEvaluations
                    .Where(x => x.UserEvaluatingId == peerEvaluaterId)
                    .Where(x => x.UserBeingEvaluatedId == peerBeingEvaluatedId)
                    .ToListAsync();
            }

            //Returns all instances with PeerEvaluaterId
            if (peerEvaluaterId != null) {
                return result = await _context.PeerEvaluations
                                .Where(x => x.UserEvaluatingId == peerEvaluaterId)
                                .ToListAsync();   
                                   
            }

             //Returns all instances with PeerBeingEvaluatedId 
            if (peerBeingEvaluatedId != null) {
                return result = await _context.PeerEvaluations
                                    .Where(x => x.UserBeingEvaluatedId == peerBeingEvaluatedId)
                                    .ToListAsync();
                
            }
            
            return BadRequest();
         }

         /// GET
         /// Summary: Returns a PeerEvaluation matching an id
         /// Produces: 
         ///     application/json
         /// Parameters: 
         ///    id
         ///     in: path
         ///     description: The Id of the PeerEvaluation
         ///     required: True
         ///     type: Integer
         /// Responses: 
         ///     200 : Success
         ///     404 : NotFound, If there is no evaulation.
         [HttpGet("{id}")]
         public async Task<ActionResult<PeerEvaluation>> GetPeerEvaluation(int id)
         {
             var evaluation = await _context.PeerEvaluations.FindAsync(id);

             if (evaluation == null)
             {
                 return NotFound();
             }

             return evaluation;
         }



         /// PUT
         /// Summary: Edits a PeerEvaluation matching an id
         /// Produces: 
         ///     application/json
         /// Parameters: 
         ///    id
         ///     in: path
         ///     description: The id of the PeerEvaluation to edit
         ///     required: True
         ///     type: Integer
         ///    evaluation
         ///     in: path
         ///     description: The edited peer evaluation
         ///     required: True
         ///     type: PeerEvaluation
         /// Responses: 
         ///     200 : Success
         ///     400 : BadRequest, If id does not match the PeerEvaluation Id 
         ///     404 : NotFound, If there is not evaluation.
         [HttpPut("{id}")]
         public async Task<IActionResult> PutPeerEvaluation(int id, PeerEvaluation evaluation)
         {
             if (id != evaluation.PeerEvaluationId)
             {
                 return BadRequest();
             }

             _context.Entry(evaluation).State = EntityState.Modified;

             try
             {
                 await _context.SaveChangesAsync();
             }
             catch (DbUpdateConcurrencyException)
             {
                 if (!PeerEvaluationExists(id))
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
         /// Summary: Creates a PeerEvaluation 
         /// Produces: 
         ///     application/json
         /// Parameters: 
         ///    evaluation
         ///     in: body
         ///     description: The peer evaluation to create
         ///     required: True
         ///     type: PeerEvaluation
         /// Responses: 
         ///     201 : Created
         [HttpPost]
         public async Task<ActionResult<PeerEvaluation>> PostPeerEvaluation(PeerEvaluation evaluation)
         {
             _context.PeerEvaluations.Add(evaluation);
             await _context.SaveChangesAsync();

             return CreatedAtAction(nameof(GetPeerEvaluationsByStudents), 
                                    new { id = evaluation.PeerEvaluationId }, 
                                    evaluation);
         }


         /// PUT
         /// Summary: Deletes a PeerEvaluation matching an id
         /// Produces: 
         ///     application/json
         /// Parameters: 
         ///    id
         ///     in: path
         ///     description: The id of the PeerEvaluation to delete
         ///     required: True
         ///     type: Integer
         /// Responses: 
         ///     204 : NoContent, If the evaulation is removed
         ///     404 : NotFound, If there is not evaluation to delete.
         [HttpDelete("{id}")]
         public async Task<IActionResult> DeletePeerEvaluation(int id)
         {
             var peerEvaluation = await _context.PeerEvaluations.FindAsync(id);
             if (peerEvaluation == null)
             {
                 return NotFound();
             }

             _context.PeerEvaluations.Remove(peerEvaluation);
             await _context.SaveChangesAsync();

             return NoContent();
         }

         //Helper functions used to see if an evaluation exists 
         //Parameters: The id of the PeerEvaluation as an Integer
         private bool PeerEvaluationExists(int id)
         {
             return _context.PeerEvaluations.Any(e => e.PeerEvaluationId == id);
         }
     }
 }