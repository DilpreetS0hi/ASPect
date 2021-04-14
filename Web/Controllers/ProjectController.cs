using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ASPectLibrary;
using Web.Data;
using System.Text.Json;
using Microsoft.AspNetCore.Cors;
using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    [EnableCors("CORSPolicy")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Project
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
        {
            JsonSerializerSettings options = new()
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                
            };
            var projJson = JsonConvert.SerializeObject(await _context.Projects.Include(i => i.Memberships).ThenInclude(m => m.Student).Include(i=>i.Course).Include(i=>i.ProjectCategory).ToListAsync(), options);
            //Console.WriteLine("json: " + projJson);
            List<Project> projDeserialized = System.Text.Json.JsonSerializer.Deserialize<List<Project>>(projJson);
            return projDeserialized;
        }

        // GET: api/Project/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);

            JsonSerializerSettings options = new()
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                
            };

            if (project == null)
            {
                return NotFound();
            } else {
                var projJson = JsonConvert.SerializeObject(await _context.Projects.Include(i => i.Memberships).ThenInclude(m => m.Student).FirstOrDefaultAsync(i => i.ProjectId == id), options);
                Project projDeserialized = System.Text.Json.JsonSerializer.Deserialize<Project>(projJson);
                return projDeserialized;
            }
        }

        // PUT: api/Project/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProject(int id, Project project)
        {
            if (id != project.ProjectId)
            {
                return BadRequest();
            }

            _context.Entry(project).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectExists(id))
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

        // POST: api/Project
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Project>> PostProject(Project project)
        {
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProject", new { id = project.ProjectId }, project);
        }

        // DELETE: api/Project/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProjectExists(int id)
        {
            return _context.Projects.Any(e => e.ProjectId == id);
        }
    }
}
